const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Products = sequelize.define('products', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    categoryId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    price: {
        type: DataTypes.DECIMAL,
        allowNull: false
    },
    weight: {
        type: DataTypes.DECIMAL,
        allowNull: true
    },
    image: {
        type: DataTypes.STRING,
        allowNull: true
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    shortDescription: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    addiotionalInformation: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    options: {
        type: DataTypes.JSON,
        allowNull: true
    },
    color: {
        type: DataTypes.JSON,
        allowNull: true
    },
    homeScreen: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
    },
    hasDiscount: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
    },
    dimension: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    tableName: 'products',
    timestamps: true,
});


module.exports = Products