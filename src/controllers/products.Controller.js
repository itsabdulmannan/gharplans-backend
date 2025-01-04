const Products = require('../models/product.Model');
const Category = require('../models/category.Model');
const { Op } = require('sequelize');
const Review = require('../models/review.Model');
const sequelize = require('../config/database');
const discountedProducts = require('../models/discountedProducts.Model');
const similerProductModel = require('../models/similarProducts.Model');

const productController = {
    getProducts: async (req, res) => {
        try {
            const { id, name, minPrice, maxPrice, offset, limit } = req.query;

            // Pagination
            const pageOffset = parseInt(offset) || 0;
            const pageLimit = parseInt(limit) || 10;

            if (id) {
                const product = await Products.findOne({
                    where: { id },
                    include: {
                        model: Category,
                        attributes: ['id', 'name'],
                    },
                });

                if (!product) {
                    return res.status(404).json({ error: "Product not found" });
                }

                const reviews = await Review.findAll({
                    where: { productId: id, status: 'approved' },
                    attributes: [[sequelize.fn('avg', sequelize.col('rating')), 'averageRating']],
                });

                const averageRating = reviews.length > 0 ? reviews[0].get('averageRating') : 0;

                const host = req.protocol + '://' + req.get('host');
                const productJson = product.toJSON();

                const productPrice = parseFloat(productJson.price);
                if (isNaN(productPrice)) {
                    return res.status(400).json({ error: "Invalid product price" });
                }

                const result = {
                    ...productJson,
                    category: {
                        categoryId: product.category.id,
                        name: product.category.name,
                    },
                    image: host + productJson.image,
                    rating: averageRating,
                    discountTiers: []
                };

                if (product.hasDiscount) {
                    const discountTiers = await discountedProducts.findAll({
                        where: { productId: id },
                    });

                    if (discountTiers.length === 0) {
                        result.discountTiers.push({
                            range: "No discount tiers available",
                            discountedPrice: productPrice.toFixed(2),
                        });
                    } else {
                        for (let tier of discountTiers) {
                            const { startRange, endRange, discount } = tier;
                            const discountedPrice = productPrice * (1 - discount / 100);

                            result.discountTiers.push({
                                range: `${startRange}-${endRange}`,
                                discountedPrice: discountedPrice.toFixed(2),
                            });
                        }
                    }
                } else {
                    result.discountTiers.push({
                        range: "No discount",
                        discountedPrice: productPrice.toFixed(2),
                    });
                }

                delete result.categoryId;
                delete result.createdAt;
                delete result.updatedAt;

                return res.status(200).json(result);
            }

            // Pagination and filtering for product listing
            const whereConditions = {};
            if (name) {
                whereConditions.name = { [Op.like]: `%${name}%` };
            }
            if (minPrice) {
                whereConditions.price = { [Op.gte]: parseFloat(minPrice) };
            }
            if (maxPrice) {
                whereConditions.price = {
                    ...whereConditions.price,
                    [Op.lte]: parseFloat(maxPrice),
                };
            }

            const { count, rows: products } = await Products.findAndCountAll({
                where: whereConditions,
                order: [
                    ['homeScreen', 'DESC'],
                    ['createdAt', 'DESC'],
                ],
                include: {
                    model: Category,
                    attributes: ['id', 'name'],
                },
                offset: pageOffset,
                limit: pageLimit,
            });

            const host = req.protocol + '://' + req.get('host');

            const result = await Promise.all(products.map(async (product) => {
                const productJson = product.toJSON();

                const productPrice = parseFloat(productJson.price);
                if (isNaN(productPrice)) {
                    return {
                        error: "Invalid product price",
                        productId: product.id
                    };
                }

                const reviews = await Review.findAll({
                    where: { productId: product.id, status: 'approved' },
                    attributes: [[sequelize.fn('avg', sequelize.col('rating')), 'averageRating']],
                });

                const averageRating = reviews.length > 0 ? reviews[0].get('averageRating') : 0;

                const productResult = {
                    ...productJson,
                    category: {
                        categoryId: product.category.id,
                        name: product.category.name,
                    },
                    image: host + productJson.image,
                    rating: averageRating,
                    discountTiers: []
                };

                if (product.hasDiscount) {
                    const discountTiers = await discountedProducts.findAll({
                        where: { productId: product.id },
                    });

                    if (discountTiers.length === 0) {
                        productResult.discountTiers.push({
                            range: "No discount tiers available",
                            discountedPrice: productPrice.toFixed(2),
                        });
                    } else {
                        for (let tier of discountTiers) {
                            const { startRange, endRange, discount } = tier;
                            const discountedPrice = productPrice * (1 - discount / 100);

                            productResult.discountTiers.push({
                                range: `${startRange}-${endRange}`,
                                discountedPrice: discountedPrice.toFixed(2),
                            });
                        }
                    }
                } else {
                    productResult.discountTiers.push({
                        range: "No discount",
                        discountedPrice: productPrice.toFixed(2),
                    });
                }

                delete productResult.categoryId;
                delete productResult.createdAt;
                delete productResult.updatedAt;

                return productResult;
            }));

            const pagination = {
                totalRecords: count,
                totalPages: Math.ceil(count / pageLimit),
                currentPage: Math.floor(pageOffset / pageLimit) + 1,
                perPage: pageLimit
            };

            res.status(200).json({
                status: true,
                products: result,
                pagination
            });

        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    createProduct: async (req, res) => {
        try {
            console.log(req.body)
            const product = await Products.create(req.body);
            res.status(201).json(product);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    updateProduct: async (req, res) => {
        try {
            const { id } = req.params;
            const product = await Products.findByPk(id);
            if (!product) {
                return res.status(404).json({ error: 'Product not found' });
            }
            await product.update(req.body);
            res.status(200).json(product);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    deleteProduct: async (req, res) => {
        try {
            const { id } = req.params;
            const product = await Products.findByPk(id);
            if (!product) {
                return res.status(404).json({ error: 'Product not found' });
            }
            await product.destroy();
            res.status(200).json({ message: 'Product deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    changeOrder: async (req, res) => {
        try {
            const { productId, homePage } = req.body;
            console.log(productId, homePage);

            const product = await Products.findByPk(productId);
            if (!product) {
                return res.status(404).json({ error: 'Product not found' });
            }

            if (homePage === 1) {
                await product.update({ homeScreen: true });
            } else {
                await product.update({ homeScreen: false });
            }

            return res.status(200).json({ message: 'Order changed successfully' });
        } catch (error) {
            console.error("Error while changing order:", error);
            return res.status(500).json({ error: error.message });
        }
    },
    addDiscountTiers: async (req, res) => {
        try {
            const { productId, discountTiers } = req.body;
            const product = await Products.findByPk(productId);

            if (!product) {
                return res.status(404).json({ error: 'Product not found' });
            }

            for (let tier of discountTiers) {
                const { startRange, endRange, discount } = tier;

                const parsedDiscount = parseFloat(discount.replace('%', '').trim());

                if (isNaN(parsedDiscount) || parsedDiscount < 0 || parsedDiscount > 100) {
                    return res.status(400).json({ error: 'Discount should be a valid number between 0 and 100' });
                }

                const overlappingTier = await discountedProducts.findAll({
                    where: {
                        [Op.or]: [
                            { startRange: { [Op.between]: [startRange, endRange] } },
                            { endRange: { [Op.between]: [startRange, endRange] } },
                            {
                                startRange: { [Op.lte]: startRange },
                                endRange: { [Op.gte]: endRange },
                            },
                        ],
                    },
                });

                if (overlappingTier.length > 0) {
                    return res.status(400).json({ error: 'Overlapping tier found' });
                }

                await discountedProducts.create({
                    productId,
                    startRange,
                    endRange,
                    discount: parsedDiscount,
                });
            }

            if (!product.hasDiscount) {
                await Products.update({ hasDiscount: true }, { where: { id: productId } });
            }

            return res.status(200).json({
                message: 'Discount tiers added successfully',
            });
        } catch (error) {
            console.error("Error while adding discount tiers:", error);
            return res.status(500).json({ error: error.message });
        }
    },
    addSimilarProducts: async (req, res) => {
        try {
            console.log("first")
            const { productId, similarProducts } = req.body;

            const product = await Products.findByPk(productId);

            if (!product) {
                return res.status(404).json({ error: 'Product not found' });
            }

            const createdSimilarProducts = [];

            for (const similarProductId of similarProducts) {
                const similarProduct = await Products.findByPk(similarProductId);

                if (!similarProduct) {
                    return res.status(404).json({
                        error: `Similar product with ID ${similarProductId} not found`,
                    });
                }

                const createdEntry = await similerProductModel.create({
                    productId,
                    similarProductId,
                });

                createdSimilarProducts.push(createdEntry);
            }

            return res.status(200).json({
                status: true,
                message: 'Similar products added successfully',
                data: createdSimilarProducts,
            });
        } catch (error) {
            console.error("Error while adding similar products:", error);
            return res.status(500).json({ error: error.message });
        }
    },
    getSimilarProducts: async (req, res) => {
        try {
            const { productId } = req.params;

            const product = await Products.findByPk(productId);

            if (!product) {
                return res.status(404).json({ error: 'Product not found' });
            }

            const similarProducts = await similerProductModel.findAll({
                where: { productId },
                include: [
                    {
                        model: Products,
                        as: 'similarProductDetails',
                        attributes: ['id', 'name', 'price', 'image'],
                    },
                ],
                raw: true,
            });

            const host = req.protocol + '://' + req.get('host');

            const response = similarProducts.map(item => {
                return {
                    id: item['similarProductDetails.id'],
                    name: item['similarProductDetails.name'],
                    price: item['similarProductDetails.price'],
                    image: host + item['similarProductDetails.image']
                };
            });

            return res.status(200).json({
                status: true,
                message: 'Similar products fetched successfully',
                data: response,
            });
        } catch (error) {
            console.error("Error while fetching similar products:", error);
            return res.status(500).json({ error: error.message });
        }
    }
};

module.exports = productController;