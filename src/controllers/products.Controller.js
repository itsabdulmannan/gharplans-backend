const Products = require('../models/product.Model');
const Category = require('../models/category.Model');
const { Op } = require('sequelize');
const Review = require('../models/review.Model');
const sequelize = require('../config/database');
const discountedProducts = require('../models/discountedProducts.Model');
const similarProductModel = require('../models/similarProducts.Model');
const ProductColors = require('../models/productColor.Model');

const productController = {
    getProducts: async (req, res) => {
        try {
            const { id, name, minPrice, maxPrice, offset, limit, categoryId } = req.query;
            console.log(categoryId)
            const pageOffset = parseInt(offset) || 0;
            const pageLimit = parseInt(limit) || 10;
            console.log(minPrice, maxPrice)
            const whereConditions = {};
            if (categoryId) {
                whereConditions.categoryId = categoryId;
            }
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

            if (id) {
                const product = await Products.findOne({
                    where: { id },
                    include: [
                        {
                            model: Category,
                            attributes: ['id', 'name'],
                        },
                        {
                            model: ProductColors,
                            as: 'colors',
                            attributes: ['id', 'color', 'image'],
                        },
                    ],
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
                    image: productJson.image
                        ? `${process.env.BASE_URL}/${productJson.image.replace(/^\/|\/$/g, '')}`
                        : `${process.env.BASE_URL}/https://picsum.photos/200/300`,
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

            const { count, rows: products } = await Products.findAndCountAll({
                where: whereConditions,
                include: [
                    {
                        model: Category,
                        attributes: ['id', 'name'],
                    },
                    {
                        model: ProductColors,
                        as: 'colors',
                        attributes: ['id', 'color', 'image'],
                    },
                ],
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
                    image: productJson.image
                        ? `${process.env.BASE_URL}/${productJson.image.replace(/^\/|\/$/g, '')}`
                        : `${process.env.BASE_URL}/https://picsum.photos/200/300`,

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
            const {
                name,
                price,
                categoryId,
                description,
                shortDescription,
                additionalInformation,
                status,
                weight,
                options,
                colors
            } = req.body;

            console.log(req.body);

            if (!name || !price || !categoryId || !description) {
                return res.status(400).json({
                    error: 'Name, price, category, and description are required'
                });
            }

            const product = await Products.create({
                name,
                price: parseFloat(price),
                categoryId,
                description,
                shortDescription: shortDescription || '',
                addiotionalInformation: additionalInformation || '',
                status: status === 'true',
                weight: weight || null,
                options: Array.isArray(options) ? options : []
            });

            if (req.files && Array.isArray(colors)) {
                const colorPromises = colors.map(async (color, index) => {
                    const colorFiles = req.files[`colors[${index}][images]`] || [];

                    if (colorFiles.length === 0) {
                        return;
                    }

                    const imageUrls = colorFiles.map(file => `/images/${file.filename}`);

                    return ProductColors.create({
                        productId: product.id,
                        color: color.name,
                        image: imageUrls
                    });
                });

                await Promise.all(colorPromises);
            }

            const completeProduct = await Products.findByPk(product.id, {
                include: [{
                    model: ProductColors,
                    as: 'colors'
                }]
            });

            res.status(201).json({
                message: 'Product created successfully',
                product: completeProduct
            });

        } catch (error) {
            console.error('Error creating product:', error);
            res.status(500).json({
                error: 'Failed to create product',
                details: error.message
            });
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
    getDiscount: async (req, res) => {
        try {
            const { productId } = req.params;
            console.log(productId);

            const product = await Products.findByPk(productId);

            if (!product) {
                return res.status(404).json({ error: 'Product not found' });
            }

            const discounts = await discountedProducts.findAll({ where: { productId } });

            if (!discounts || discounts.length === 0) {
                return res.status(200).json({
                    status: true,
                    message: 'No discount available',
                    data: [],
                });
            }

            return res.status(200).json({
                status: true,
                message: 'Discounts fetched successfully',
                data: discounts,
            });
        } catch (error) {
            console.error("Error while fetching discounts:", error);
            return res.status(500).json({ error: error.message });
        }
    },
    deleteDiscountTiers: async (req, res) => {
        try {
            const { productId, discountTierId } = req.params;

            const product = await Products.findByPk(productId);
            if (!product) {
                return res.status(404).json({ error: 'Product not found' });
            }

            const deletedRowCount = await discountedProducts.destroy({
                where: { productId, id: discountTierId }
            });

            if (deletedRowCount === 0) {
                return res.status(404).json({ error: 'Discount tier not found' });
            }

            return res.status(200).json({
                status: true,
                message: 'Discount tier deleted successfully',
            });
        } catch (error) {
            console.error("Error while deleting discount tier:", error);
            return res.status(500).json({ error: error.message });
        }
    },
    addSimilarProducts: async (req, res) => {
        try {
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

            const similarProducts = await similarProductModel.findAll({
                where: { productId },
                include: [
                    {
                        model: Products,
                        as: 'similarProductDetails',
                        attributes: ['id', 'name', 'price', 'image'],
                        include: {
                            model: ProductColors,
                            as: 'colors',
                            attributes: ['id', 'color', 'image'],
                        },
                    },
                ],
                raw: false,
            });

            const host = req.protocol + '://' + req.get('host');
            const response = similarProducts.map(item => {
                const productDetails = item.similarProductDetails;
                const colors = productDetails?.colors || [];

                return {
                    similarProductId: productDetails?.id || null,
                    name: productDetails?.name || null,
                    price: productDetails?.price || null,
                    image: productDetails?.image
                        ? `${host}/${productDetails.image.replace(/^\/|\/$/g, '')}`
                        : null,
                    colors: colors.map(colorItem => ({
                        color: colorItem?.color || null,
                        image: colorItem?.image
                            ? [`${host}/${colorItem.image.replace(/^\/|\/$/g, '')}`]
                            : [],
                    })),
                    productId: item.productId,
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
    },
    patchProductStatus: async (req, res) => {
        try {
            const { id, status } = req.body;
            const product = await Products.findByPk(id);
            if (!product) {
                return res.status(404).json({ error: 'Product not found' });
            }
            await product.update({ status });
            return res.status(200).json({ message: 'Product status updated successfully' });
        } catch (error) {
            console.error("Error while updating product status:", error);
            return res.status(500).json({ error: error.message });
        }
    }
};

module.exports = productController;