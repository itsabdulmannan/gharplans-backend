const user = require('../models/user.Model');
const products = require('../models/product.Model')
const favourites = require('../models/favourite.Model');
const { where } = require('sequelize');
const Review = require('../models/review.Model');
const Products = require('../models/product.Model');
const Category = require('../models/category.Model');
const ProductColors = require('../models/productColor.Model');
const ProductsDeliveryCharge = require('../models/productDeliveryCharges.Model');
const cities = require('../models/cities.Model');
const sequelize = require('../config/database');

const favouritesProductsController = {
    addToFavourite: async (req, res) => {
        try {
            const { productId } = req.body;
            const userData = req.user;
            const userId = userData.id;
            const existingUser = await user.findByPk(userId);
            if (!existingUser) {
                return res.status(404).json({ status: false, message: "User not found" });
            }

            const product = await products.findByPk(productId);
            if (!product) {
                return res.status(404).json({ status: false, message: "Product not found" });
            }

            const favProduct = await favourites.create({ userId, ProductId: productId });
            return res.status(201).json({ status: true, message: "Product added to favourites", favProduct });

        } catch (error) {
            console.error("Error while adding product to favourites", error);
            return res.status(500).json({ status: false, message: "Internal server error.", error: error.message });
        }
    },


    removeFromFavourite: async (req, res) => {
        try {
            const { productId, userId } = req.body;
            console.log("Request Body:", req.body);

            const favProduct = await favourites.findOne({ where: { userId, productId } });
            if (!favProduct) {
                return res.status(404).json({ status: false, message: "Product not found in favourites" });
            }

            await favProduct.destroy();
            return res.status(200).json({ status: true, message: "Product removed from favourites" });
        } catch (error) {
            console.error("Error while removing product from favourites", error);
            return res.status(500).json({ status: false, message: "Internal server error." });
        }
    },

    getFavouriteProducts: async (req, res) => {
        try {
            const userData = req.user;
            const userId = userData.id;

            const { offset = 0, limit = 10 } = req.query;

            const existingUser = await user.findByPk(userId);
            if (!existingUser) {
                return res.status(404).json({ status: false, message: 'User not found' });
            }

            const favProducts = await favourites.findAll({
                where: { userId },
                limit: parseInt(limit),
                offset: parseInt(offset),
                include: [
                    {
                        model: Products,
                        as: 'product',
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
                            },
                        ],
                    },
                ],
            });

            const results = [];
            for (const favItem of favProducts) {
                const product = favItem.product;

                if (!product) {
                    continue;
                }

                const productJson = product.toJSON();

                const reviews = await Review.findAll({
                    where: { productId: product.id, status: 'approved' },
                    attributes: [[sequelize.fn('avg', sequelize.col('rating')), 'averageRating']],
                });
                const averageRating = reviews.length > 0 ? reviews[0].get('averageRating') : 0;

                const productPrice = parseFloat(productJson.price);
                let discountTiers = [];

                if (product.hasDiscount) {
                    const foundDiscounts = await discountedProducts.findAll({
                        where: { productId: product.id },
                    });

                    if (foundDiscounts.length === 0) {
                        discountTiers.push({
                            range: 'No discount tiers available',
                            discountedPrice: productPrice.toFixed(2),
                        });
                    } else {
                        for (const tier of foundDiscounts) {
                            const { startRange, endRange, discount } = tier;
                            const discountedPrice = productPrice * (1 - discount / 100);
                            discountTiers.push({
                                range: `${startRange}-${endRange}`,
                                discountedPrice: discountedPrice.toFixed(2),
                            });
                        }
                    }
                } else {
                    discountTiers.push({
                        range: 'No discount',
                        discountedPrice: productPrice.toFixed(2),
                    });
                }

                const finalProductData = {
                    id: productJson.id,
                    name: productJson.name,
                    price: productJson.price,
                    category: {
                        categoryId: productJson.category ? productJson.category.id : null,
                        name: productJson.category ? productJson.category.name : null,
                    },
                    image: productJson.image
                        ? `${process.env.BASE_URL}/${productJson.image.replace(/^\/|\/$/g, '')}`
                        : `${process.env.BASE_URL}/https://picsum.photos/200/300`,
                    colors: productJson.colors || [],
                    deliveryCharges: productJson.deliveryCharges || [],
                    hasDiscount: productJson.hasDiscount,
                    rating: averageRating,
                    discountTiers,
                };

                results.push({
                    favouriteId: favItem.id,
                    userId: favItem.userId,
                    productId: favItem.productId,
                    product: finalProductData,
                    createdAt: favItem.createdAt,
                    updatedAt: favItem.updatedAt,
                });
            }

            return res.status(200).json({
                status: true,
                message: 'Favourite products fetched successfully.',
                data: results,
                pagination: {
                    limit: parseInt(limit),
                    offset: parseInt(offset),
                },
            });
        } catch (error) {
            console.error('Error while fetching favourite products', error);
            return res.status(500).json({ status: false, message: 'Internal server error.' });
        }
    },
};

module.exports = favouritesProductsController;