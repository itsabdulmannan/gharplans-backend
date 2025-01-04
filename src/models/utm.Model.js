const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const utmLink = sequelize.define('utmLink', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    baseUrl: {
        type: DataTypes.STRING,
        allowNull: false
    },
    source: {
        type: DataTypes.STRING,
        allowNull: false
    },
    medium: {
        type: DataTypes.STRING,
        allowNull: false
    },
    campaign: {
        type: DataTypes.STRING,
        allowNull: false
    },
    utmUrl: {
        type: DataTypes.STRING,
        allowNull: false
    },
    couponCode: {
        type: DataTypes.STRING,
        allowNull: true
    },
    traffic: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    hasPurchase: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
}, {
    tableName: 'utmLink',
    timestamps: true,
});

module.exports = utmLink;