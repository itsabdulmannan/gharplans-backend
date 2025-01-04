const user = require('../models/user.Model');
const products = require('../models/product.Model')
const favourites = require('../models/favourite.Model');
const { where } = require('sequelize');

const favouritesProductsController = {
    addToFavourite: async (req, res) => {
        try {
            const { productId, userId } = req.body;

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
            return res.status(500).json({ status: false, message: "Internal server error." });
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
            const { userId } = req.params;
            const { offset = 0, limit = 10 } = req.query;
            const existinguser = await user.findByPk(userId);
            if (!existinguser) {
                res.status(404).json({ status: false, message: "User not found" });
            }
            const favProducts = await favourites.findAll({
                where: { userId },
                limit: parseInt(limit),
                offset: parseInt(offset),
            });
            return res.status(200).json({
                status: true,
                message: "Favourite products fetched successfully.",
                data: favProducts,
                pagination: {
                    limit: parseInt(limit),
                    offset: parseInt(offset),
                },
            });
        } catch (error) {
            console.error("Error while fetching favourite products", error);
            res.status(500).json({ status: false, message: "Internal server error." });
        }
    }
};

module.exports = favouritesProductsController;