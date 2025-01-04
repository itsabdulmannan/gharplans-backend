const cart = require('../models/cart.Model');
const Product = require('../models/product.Model');
const User = require('../models/user.Model');
const Category = require('../models/category.Model')
const discountedProducts = require('../models/discountedProducts.Model');

const cartController = {
    addItemToCart: async (req, res) => {
        try {
            const { userId, productId, quantity } = req.body;

            const checkExisitingItem = await cart.findOne({
                where: { userId, productId }
            });

            if (checkExisitingItem) {
                return res.status(400).json({ status: false, message: "Item already exists in cart" });
            }

            const findProduct = await Product.findOne({
                where: { id: productId },
                include: [{ model: discountedProducts, as: 'discountedProducts' }] // Corrected alias
            });

            if (!findProduct) {
                return res.status(404).json({ status: false, message: "Product not found" });
            }


            let finalPrice = parseFloat(findProduct.price);

            if (findProduct.hasDiscount && findProduct.discountedProducts.length > 0) {

                const applicableDiscount = findProduct.discountedProducts.find(tier => {
                    if (tier.startRange && tier.endRange) {
                        const min = parseInt(tier.startRange, 10);
                        const max = parseInt(tier.endRange, 10);
                        return quantity >= min && quantity <= max;
                    }
                    return false;
                });

                if (applicableDiscount) {
                    const discountPercentage = parseFloat(applicableDiscount.discount);
                    finalPrice = finalPrice - (finalPrice * (discountPercentage / 100));
                } else {
                    console.log('No applicable discount for this quantity.');
                }
            } else {
                console.log('No discount available for this product.');
            }

            const cartItem = await cart.create({
                userId,
                productId,
                quantity,
                price: finalPrice.toFixed(2)
            });

            res.status(201).json({
                status: true,
                message: "Item added to cart",
                data: cartItem
            });
        } catch (error) {
            console.error("Error adding item to cart:", error);
            res.status(500).json({ status: false, message: "Internal Server Error" });
        }
    },
    getCartItem: async (req, res) => {
        try {
            const { userId } = req.query;
            const cartItems = await cart.findAll({
                where: { userId },
                include: [
                    {
                        model: User,
                        as: 'user',
                        attributes: ['id', 'name'],
                    },
                    {
                        model: Product,
                        as: 'product',
                        attributes: ['id', 'name', 'price'],
                        include: [
                            {
                                model: Category,
                                as: 'category',
                                attributes: ['name'],
                            },
                        ],
                    },
                ],
            });

            let totalCartValue = 0;

            const formattedData = cartItems.map(item => {
                const total = item.quantity * item.price;
                totalCartValue += total;

                return {
                    id: item.id,
                    product: {
                        id: item.product.id,
                        name: item.product.name,
                        category: item.product.category ? item.product.category.name : null,
                        singleProductPrice: item.product.price,
                        discountedPrice: item.price,
                    },
                    quantity: item.quantity,
                    itemTotal: total.toFixed(2),
                    createdAt: item.createdAt,
                    updatedAt: item.updatedAt,
                    user: { id: item.user.id, name: item.user.name },
                };
            });

            res.status(200).json({
                status: true,
                message: "Cart Items",
                data: formattedData,
                totalCartValue: totalCartValue.toFixed(2),
            });
        } catch (error) {
            console.error("Error getting cart items:", error);
            res.status(500).json({ status: false, message: "Internal Server Error" });
        }
    },
    updateCart: async (req, res) => {
        try {
            const { userId, productId, quantity } = req.body;

            const findProduct = await Product.findOne({
                where: {
                    id: productId
                },
                include: [{ model: discountedProducts, as: 'discountedProducts' }]
            });

            if (!findProduct) {
                return res.status(404).json({ status: false, message: "Product not found" });
            }

            let finalPrice = parseFloat(findProduct.price);

            if (findProduct.hasDiscount && findProduct.discountedProducts.length > 0) {
                const applicableDiscount = findProduct.discountedProducts.find(tier => {
                    if (tier.startRange && tier.endRange) {
                        const min = parseInt(tier.startRange, 10);
                        const max = parseInt(tier.endRange, 10);
                        return quantity >= min && quantity <= max;
                    }
                    return false;
                });

                if (applicableDiscount) {
                    const discountPercentage = parseFloat(applicableDiscount.discount);
                    finalPrice = finalPrice - (finalPrice * (discountPercentage / 100));
                }
            }

            const cartItem = await cart.findOne({
                where: {
                    userId,
                    productId
                }
            });

            if (!cartItem) {
                return res.status(404).json({ status: false, message: "Item not found in cart" });
            }

            const updatedPrice = finalPrice * quantity;

            await cartItem.update({
                quantity,
                price: updatedPrice.toFixed(2)
            });

            res.status(200).json({ status: true, message: "Cart item updated", data: cartItem });
        } catch (error) {
            console.error("Error updating cart:", error);
            res.status(500).json({ status: false, message: "Internal Server Error" });
        }
    },
    deleteCartItem: async (req, res) => {
        try {
            const { userId, productId } = req.body;
            const cartItem = await cart.findOne({
                where: {
                    userId,
                    productId
                }
            });
            if (!cartItem) {
                return res.status(404).json({ status: false, message: "Item not found in cart" });
            }
            await cartItem.destroy();
            res.status(200).json({ status: true, message: "Item removed from cart" });
        } catch (error) {
            console.error("Error deleting cart item:", error);
            res.status(500).json({ status: false, message: "Internal Server Error" });
        }
    }
}

module.exports = cartController