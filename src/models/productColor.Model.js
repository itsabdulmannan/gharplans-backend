const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ProductColors = sequelize.define('product_colors', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'products',
            key: 'id'
        }
    },
    color: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    image: {
        type: DataTypes.JSONB,
        allowNull: false,
        get() {
            const rawValue = this.getDataValue('image');
            const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
            return `${baseUrl}${rawValue}`;
        },
    }
}, {
    tableName: 'product_colors',
    timestamps: true,
});


module.exports = ProductColors;
