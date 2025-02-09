const order = require('../models/order.Model');
const User = require('../models/user.Model');
const sequelize = require('../config/database');
const cart = require('../models/cart.Model');
const paymentRecords = require('../models/paymentRecords.Model');
const { sendMail } = require('../config/mailer');
const { Op } = require('sequelize');

const orderController = {
    generateOrderId: () => {
        const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        const randomString = Math.random().toString(36).substring(2, 10).toUpperCase();
        return `GharPlans-${date}-${randomString}`;
    },
    addOrder: async (req, res) => {
        const generatedOrderId = orderController.generateOrderId();
        const { userId, productInfo, totalAmount, paymentType, sourceCity, destinationCity, deliveryCharges } = req.body;

        const transaction = await sequelize.transaction();

        try {
            let totalProductAmount = 0;
            let totalDeliveryCharges = 0;

            productInfo.forEach(product => {
                totalProductAmount += parseFloat(product.itemTotal);
                totalDeliveryCharges += parseFloat(product.quantity) * parseFloat(product.deliveryCharges);
            });
            const recalculatedTotalAmount = totalProductAmount + totalDeliveryCharges;
            const orderData = {
                userId,
                productInfo,
                totalAmount: recalculatedTotalAmount.toFixed(2),
                paymentType,
                sourceCity,
                destinationCity,
                deliveryCharges: totalDeliveryCharges.toFixed(2),
                orderId: generatedOrderId
            };
            const newOrder = await order.create(orderData, { transaction });

            await cart.destroy({
                where: { userId },
                transaction
            });

            await transaction.commit();

            res.status(201).json({
                status: true,
                message: "Order added successfully and cart cleared.",
                data: newOrder
            });
        } catch (error) {
            await transaction.rollback();
            console.error("Error in addOrder: ", error);
            res.status(500).json({ status: false, message: "Internal server error." });
        }
    },
    getOrders: async (req, res) => {
        const { orderId, status, name, userId, limit, offset } = req.query;

        const pageLimit = parseInt(limit) || 10;
        const pageOffset = parseInt(offset) || 0;

        const queryOptions = {
            limit: pageLimit,
            offset: pageOffset,
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'firstName', 'lastName', 'email', 'contactNo', 'address', 'city', 'profileImage'],
                    where: {},
                }
            ]
        };

        if (orderId) {
            queryOptions.where = { ...queryOptions.where, orderId };
        }
        if (status) {
            queryOptions.where = { ...queryOptions.where, status };
        }
        if (name) {
            queryOptions.include[0].where = {
                ...queryOptions.include[0].where,
                [Op.or]: [
                    { firstName: { [Op.like]: `%${name}%` } },
                    { lastName: { [Op.like]: `%${name}%` } }
                ]
            };
        }

        if (userId) {
            queryOptions.where = { ...queryOptions.where, userId };
        }

        try {
            if (orderId) {
                const ordersData = await order.findOne(queryOptions);
                if (ordersData) {
                    const responseData = { ...ordersData.toJSON() };
                    delete responseData.userId;
                    res.status(200).json({ status: true, orderData: responseData });
                } else {
                    res.status(404).json({ status: false, message: "Order not found." });
                }
            } else {
                const { count, rows: ordersData } = await order.findAndCountAll(queryOptions);
                if (ordersData.length > 0) {
                    const responseData = ordersData.map(order => ({
                        ...order.toJSON(),
                        totalItemsPurchased: order.productInfo.reduce((total, product) => total + product.quantity, 0),
                    }));

                    const userItemsCount = responseData.reduce((acc, order) => {
                        const userId = order.user.id;
                        acc[userId] = (acc[userId] || 0) + order.totalItemsPurchased;
                        return acc;
                    }, {});

                    res.status(200).json({
                        status: true,
                        ordersData: responseData,
                        totalItemsByUser: userItemsCount,
                        // totalItems: count,
                        pagination: {
                            limit: pageLimit,
                            offset: pageOffset
                        }
                    });
                } else {
                    res.status(404).json({ status: false, message: "No orders found." });
                }
            }
        } catch (error) {
            console.error("Error in getOrders: ", error);
            res.status(500).json({ status: false, message: "Internal server error." });
        }
    },
    cancelOrder: async (req, res) => {
        const { orderId } = req.params;
        try {
            const orderData = await order.findOne({ where: { orderId } });
            if (orderData) {
                await order.destroy({ where: { orderId } });
                res.status(200).json({ status: true, message: "Order deleted successfully." });
            } else {
                res.status(404).json({ status: false, message: "Order not found." });
            }
        } catch (error) {
            console.error("Error in deleteOrder: ", error);
            res.status(500).json({ status: false, message: "Internal server error." });
        }
    },
    uploadScreenShot: async (req, res) => {
        const { orderId } = req.params;
        const { screenshot } = req.body;
        try {
            const orderData = await order.findOne({ where: { orderId } });
            if (orderData) {
                await paymentRecords.create({
                    orderId: orderId,
                    screenShot: screenshot,
                    paymentStatus: 'pending',
                    paymentType: 'bank',
                });
                const adminEmail = process.env.ADMIN_EMAIL;

                const mailOptions = {
                    from: process.env.SMTP_MAIL,
                    to: adminEmail,
                    subject: `Payment Screenshot Uploaded - Order ID: ${orderId}`,
                    text: `Admin,\n\nA screenshot for payment has been uploaded for order ID ${orderId}. Please verify the payment.\n\nThank you.`,
                };

                await sendMail(mailOptions);

                res.status(200).json({ status: true, message: "Screenshot uploaded successfully." });
            } else {
                res.status(404).json({ status: false, message: "Order not found." });
            }
        } catch (error) {
            console.error("Error in uploadScreenShot: ", error);
            res.status(500).json({ status: false, message: "Internal server error." });
        }
    },
    verifyPayment: async (req, res) => {
        const { orderId } = req.params;
        const { paymentStatus } = req.body;
        try {
            const orderData = await order.findOne({ where: { orderId } });
            if (orderData) {
                if (['approved', 'rejected'].includes(paymentStatus)) {
                    await order.update({ paymentStatus }, { where: { orderId } });
                    await paymentRecords.update({ paymentStatus }, { where: { orderId } });

                    if (paymentStatus === 'approved') {
                        const user = await User.findOne({ where: { id: orderData.userId } });

                        if (user) {
                            const mailOptions = {
                                from: process.env.SMTP_MAIL,
                                to: user.email,
                                subject: `Payment Successful - Order ID: ${orderId}`,
                                text: `Dear ${user.name},\n\nYour payment for Order ID: ${orderId} has been successfully verified. Your order is now complete.\n\nThank you for shopping with us!`,
                            };

                            await sendMail(mailOptions);
                        }
                    }

                    res.status(200).json({ status: true, message: "Payment status updated successfully." });
                } else {
                    res.status(400).json({ status: false, message: "Invalid payment status." });
                }
            } else {
                res.status(404).json({ status: false, message: "Order not found." });
            }
        } catch (error) {
            console.error("Error in verifyPayment: ", error);
            res.status(500).json({ status: false, message: "Internal server error." });
        }
    },
    getAllPaymentScreenshots: async (req, res) => {
        try {
            const { pending, approved, rejected } = req.query;

            const conditions = [];

            if (pending !== undefined) conditions.push({ paymentStatus: 'pending' });
            if (approved !== undefined) conditions.push({ paymentStatus: 'approved' });
            if (rejected !== undefined) conditions.push({ paymentStatus: 'rejected' });

            if (conditions.length > 0) {
                const paymentScreenshots = await paymentRecords.findAll({
                    where: {
                        [Op.or]: conditions
                    }
                });

                const responseData = {
                    pendingPaymentScreenshots: [],
                    approvedPaymentScreenshots: [],
                    rejectedPaymentScreenshots: []
                };

                // Filter the data based on payment status and populate responseData
                if (pending !== undefined) {
                    responseData.pendingPaymentScreenshots = paymentScreenshots.filter(payment => payment.paymentStatus === 'pending');
                }

                if (approved !== undefined) {
                    responseData.approvedPaymentScreenshots = paymentScreenshots.filter(payment => payment.paymentStatus === 'approved');
                }

                if (rejected !== undefined) {
                    responseData.rejectedPaymentScreenshots = paymentScreenshots.filter(payment => payment.paymentStatus === 'rejected');
                }

                return res.status(200).json({ status: true, ...responseData });
            }

            res.status(400).json({ status: false, message: "No valid status filter provided in the query." });
        } catch (error) {
            console.error("Error in getAllPaymentScreenshots: ", error);
            res.status(500).json({ status: false, message: "Internal server error." });
        }
    },
};

module.exports = orderController;
