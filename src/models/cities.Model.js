const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const cities = sequelize.define('cities', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    }
}, {
    tableName: 'cities',
    timestamps: true,
});

module.exports = cities;