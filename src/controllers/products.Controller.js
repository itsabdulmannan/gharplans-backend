const Products = require('../models/product.Model');
const Category = require('../models/category.Model');
const { Op, where, Sequelize } = require('sequelize');
const Review = require('../models/review.Model');
const sequelize = require('../config/database');
const discountedProducts = require('../models/discountedProducts.Model');
const similarProductModel = require('../models/similarProducts.Model');
const ProductColors = require('../models/productColor.Model');
const ProductsDeliveryCharge = require('../models/productDeliveryCharges.Model');
const cities = require('../models/cities.Model');

const productController = {
    getProducts: async (req, res) => {
        try {
            const { id, name, minPrice, maxPrice, offset, limit, categoryId } = req.query;
            const pageOffset = parseInt(offset) || 0;
            const pageLimit = parseInt(limit) || 10;
            const whereConditions = {};
            if (categoryId) {
                whereConditions.categoryId = categoryId;
            }
            if (name) {
                whereConditions.name = { [Op.iLike]: `%${name}%` };
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
                        {
                            model: ProductsDeliveryCharge,
                            as: 'deliveryCharges',
                            attributes: ['id', 'sourceCityId', 'destinationCityId', 'deliveryCharge'],
                            include: [
                                {
                                    model: cities,
                                    as: 'sourceCity',
                                    attributes: ['id', 'name'],
                                },
                                {
                                    model: cities,
                                    as: 'destinationCity',
                                    attributes: ['id', 'name'],
                                },
                            ],
                        }
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
                            // const discountedPrice = productPrice * (1 - discount / 100);

                            result.discountTiers.push({
                                range: `${startRange}-${endRange}`,
                                discountedPrice: discount,
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
                    {
                        model: ProductsDeliveryCharge,
                        as: 'deliveryCharges',
                        attributes: ['id', 'sourceCityId', 'destinationCityId', 'deliveryCharge'],
                        include: [
                            {
                                model: cities,
                                as: 'sourceCity',
                                attributes: ['id', 'name'],
                            },
                            {
                                model: cities,
                                as: 'destinationCity',
                                attributes: ['id', 'name'],
                            },
                        ],
                    }
                ],
                distinct: true,
                order: [['homeScreen', 'DESC']],
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
                            // const discountedPrice = productPrice * (1 - discount / 100);

                            productResult.discountTiers.push({
                                range: `${startRange}-${endRange}`,
                                discountedPrice: discount,
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
                colors,
                dimensions,
                currency,
                unit
            } = req.body;
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
                additionalInformation: additionalInformation || '',
                status: status === 'true',
                weight: weight || null,
                options: Array.isArray(options) ? options : [],
                dimension: dimensions || null,
                currency,
                unit
            });

            if (req.files && Array.isArray(colors)) {
                const colorPromises = colors.map(async (color, index) => {
                    const colorFiles = req.files[`colors[${index}][images]`] || [];

                    if (colorFiles.length === 0) {
                        return null;
                    }

                    const imageUrls = colorFiles.map((file) => `/images/${file.filename}`);

                    return ProductColors.create({
                        productId: product.id,
                        color: color.name,
                        image: imageUrls
                    });
                });

                await Promise.all(colorPromises);
            }

            const completeProduct = await Products.findByPk(product.id, {
                include: [
                    {
                        model: ProductColors,
                        as: 'colors'
                    }
                ]
            });

            return res.status(201).json({
                message: 'Product created successfully',
                product: completeProduct
            });
        } catch (error) {
            console.error('Error creating product:', error);
            return res.status(500).json({
                error: 'Failed to create product',
                details: error.message
            });
        }
    },
    updateProduct: async (req, res) => {
        try {
            const { id } = req.params;
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
                colors,
                dimensions,
                currency,
                unit
            } = req.body;
            console.log("Id", id, "----------------", "Req Body", req.body)
            // 1) Find existing product
            const product = await Products.findByPk(id);
            if (!product) {
                return res.status(404).json({ error: 'Product not found' });
            }

            // 2) Update main product fields
            await product.update({
                name,
                price: parseFloat(price),
                categoryId,
                description,
                shortDescription: shortDescription || '',
                additionalInformation: additionalInformation || '',
                status: status === 'true',
                weight: weight || null,
                options: Array.isArray(options) ? options : [],
                dimension: dimensions || null,
                currency,
                unit
            });

            // 3) If there are color updates, remove old color records and re-create
            if (req.files && Array.isArray(colors)) {
                // Remove old color records
                await ProductColors.destroy({ where: { productId: product.id } });

                // Re-create color records
                const colorPromises = colors.map(async (color, index) => {
                    const colorFiles = req.files[`colors[${index}][images]`] || [];

                    if (colorFiles.length === 0) {
                        // If the user didn't upload new images for this color, you could skip
                        // or create an entry without images. Adjust to your needs.
                        return null;
                    }

                    // Build an array of file paths
                    const imageUrls = colorFiles.map((file) => `/images/${file.filename}`);

                    return ProductColors.create({
                        productId: product.id,
                        color: color.name,
                        image: imageUrls
                    });
                });

                await Promise.all(colorPromises);
            }

            // 4) Fetch updated product + colors for the response
            const completeProduct = await Products.findByPk(product.id, {
                include: [{ model: ProductColors, as: 'colors' }]
            });

            return res.status(200).json({
                message: 'Product updated successfully',
                product: completeProduct
            });
        } catch (error) {
            console.error('Error updating product:', error);
            return res.status(500).json({ error: error.message });
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

            if (typeof productId === "undefined" || typeof homePage === "undefined") {
                return res.status(400).json({ error: "productId and homePage are required" });
            }

            const product = await Products.findByPk(productId);
            if (!product) {
                return res.status(404).json({ error: "Product not found" });
            }

            await product.update({ homeScreen: homePage === 1 });

            return res.status(200).json({ message: "Home screen status updated successfully" });
        } catch (error) {
            console.error("Error while changing home screen status:", error);
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
                        productId,
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
            const { productId, featuredIds } = req.body;

            const product = await Products.findByPk(productId);
            console.log(productId, featuredIds, req.body);
            if (!product) {
                return res.status(404).json({ error: 'Product not found' });
            }

            const createdSimilarProducts = [];

            for (const similarProductId of featuredIds) {
                const similarProduct = await Products.findByPk(similarProductId);

                if (!similarProduct) {
                    return res.status(404).json({
                        error: `Similar product with ID ${similarProductId} not found`,
                    });
                }

                const createdEntry = await similarProductModel.create({
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

            const response = similarProducts.map((item) => {
                const productDetails = item.similarProductDetails;
                const colors = productDetails?.colors || [];

                return {
                    similarProductId: productDetails?.id || null,
                    name: productDetails?.name || null,
                    price: productDetails?.price || null,
                    image: productDetails?.image || null,
                    colors: colors.map((colorItem) => ({
                        color: colorItem.color || null,
                        image: colorItem.image || []
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
    },
    getFeacturedProducts: async (req, res) => {
        try {
            const featuredProducts = await Products.findAll({
                where: { homeScreen: true },
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
            })

            return res.status(200).json({
                status: true,
                message: 'Featured products fetched successfully',
                data: featuredProducts,
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    updateStock: async (req, res) => {
        try {
            const { productId, stock } = req.body;
            const product = await Products.findByPk(productId);
            if (!product) {
                return res.status(404).json({ error: 'Product not found' });
            }
            await Products.update(
                { totalProducts: stock, remainingProduct: stock },
                { where: { id: productId } }
            );
            return res.status(200).json({ message: 'Product quantity updated successfully' });
        } catch (error) {
            console.error("Error while updating product quantity:", error);
            return res.status(500).json({ error: error.message });
        }
    },
    getCarouselProducts: async (req, res) => {
        try {
            const carouselProducts = await Products.findAll({
                where: { homeScreen: true },
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
                    {
                        model: ProductsDeliveryCharge,
                        as: 'deliveryCharges',
                        attributes: ['id', 'sourceCityId', 'destinationCityId', 'deliveryCharge'],
                        include: [
                            {
                                model: cities,
                                as: 'sourceCity',
                                attributes: ['id', 'name'],
                            },
                            {
                                model: cities,
                                as: 'destinationCity',
                                attributes: ['id', 'name'],
                            },
                        ],
                    }
                ],
            })

            return res.status(200).json({
                status: true,
                message: 'Carousel products fetched successfully',
                data: carouselProducts,
            });
        } catch (error) {
            console.error("Error while fetching carousel products:", error);
            return res.status(500).json({ error: error.message });
        }
    },
    updateCarouselProduct: async (req, res) => {
        try {
            const { currentProductId, newProductId, homePage } = req.body;
            console.log(req.body)
            const currentProduct = await Products.findByPk(currentProductId);
            if (!currentProduct) {
                return res.status(404).json({ error: 'Current product not found' });
            }

            const newProduct = await Products.findByPk(newProductId);
            if (!newProduct) {
                return res.status(404).json({ error: 'New product not found' });
            }

            await currentProduct.update({ homeScreen: false });
            await newProduct.update({ homeScreen: true });

            return res.status(200).json({ message: 'Carousel updated successfully' });
        } catch (error) {
            return res.status(500).json({ error: 'Internal server error' });
        }
    },
    getSimilarProductRelation: async (req, res) => {
        try {
            const { id } = req.params;
            const similarProducts = await similarProductModel.findAll({
                where: { productId: id },
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
            })
            return res.status(200).json({
                status: true,
                message: 'Similar products fetched successfully',
                data: similarProducts,
            });
        } catch (error) {
            return res.status(500).json({ error: 'Internal server error', error: error.message });
        }
    },
    removeSimilarProduct: async (req, res) => {
        try {
            const { id } = req.params;
            console.log(id)
            const similarProduct = await similarProductModel.findByPk(id);
            if (!similarProduct) {
                return res.status(404).json({ error: 'Similar product not found' });
            }
            await similarProduct.destroy();
            return res.status(200).json({ message: 'Similar product removed successfully' });
        } catch (error) {
            return res.status(500).json({ error: 'Internal server error' });
        }
    },
    getAllUnLinkedProducts: async (req, res) => {
        try {
            const { id } = req.params;

            const linkedProducts = await similarProductModel.findAll({
                where: { productId: id },
                attributes: ['similarProductId'],
            });

            const linkedProductIds = linkedProducts.map(fp => fp.similarProductId);

            const unLinkedProducts = await Products.findAll({
                where: {
                    id: {
                        [Sequelize.Op.notIn]: linkedProductIds,
                    }
                }
            });

            return res.status(200).json({
                status: true,
                message: 'Unlinked products fetched successfully',
                data: unLinkedProducts,
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
}
module.exports = productController;