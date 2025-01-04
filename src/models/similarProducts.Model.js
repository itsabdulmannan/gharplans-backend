const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const similerProducts = sequelize.define('similerProducts', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    similarProductId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    tableName: 'similerProducts',
    timestamps: true,
});

module.exports = similerProducts