const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Order = sequelize.define('order', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    orderId: {
        type: DataTypes.STRING,
        allowNull: false
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    productInfo: {
        type: DataTypes.JSONB,
        allowNull: false
    },
    totalAmount: {
        type: DataTypes.DECIMAL,
        allowNull: false
    },
    paymentType: {
        type: DataTypes.ENUM('cod', 'card'),
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('pending', 'approved', 'rejected'),
        allowNull: false,
        defaultValue: 'pending'
    },
    deliveryCharges: {
        type: DataTypes.DECIMAL,
        allowNull: true,
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    sourceCity: {
        type: DataTypes.STRING,
        allowNull: true
    },
    destinationCity: {
        type: DataTypes.STRING,
        allowNull: true
    },
    paymentStatus: {
        type: DataTypes.ENUM('pending', 'approved', 'rejected'),
        defaultValue: 'pending',
        allowNull: true
    }
}, {
    tableName: 'order',
    timestamps: true,
});

module.exports = Order;