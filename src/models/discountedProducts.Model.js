const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const DiscountedProducts = sequelize.define('discountedProducts', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    productId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    startRange: {
        type: DataTypes.DECIMAL,
        allowNull: false
    },
    endRange: {
        type: DataTypes.DECIMAL,
        allowNull: false
    },
    discount: {
        type: DataTypes.DECIMAL,
        allowNull: false
    },
}, {
    tableName: 'discountedProducts',
    timestamps: true,
});

module.exports = DiscountedProducts;
