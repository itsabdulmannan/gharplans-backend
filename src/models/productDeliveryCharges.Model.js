const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ProductsDeliveryCharge = sequelize.define('products_delivery_charge', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    productId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    sourceCityId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    destinationCityId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    deliveryCharge: {
        type: DataTypes.DECIMAL,
        allowNull: false
    },
}, {
    tableName: 'products_delivery_charge',
    timestamps: true,
});

module.exports = ProductsDeliveryCharge;