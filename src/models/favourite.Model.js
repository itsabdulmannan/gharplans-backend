const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const favourites = sequelize.define('favourites', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    ProductId: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: 'favourites',
    timestamps: true,
});

module.exports = favourites;
