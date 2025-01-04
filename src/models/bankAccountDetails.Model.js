const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const BankAccountDetails = sequelize.define('bankAccountDetails', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    bankName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    accountHolderName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    accountNumber: {
        type: DataTypes.STRING,
        allowNull: false
    },
    iban: {
        type: DataTypes.STRING,
        allowNull: true
    },
    branchCode: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: true
    }
}, {
    tableName: 'bankAccountDetails',
    timestamps: true,
});

module.exports = BankAccountDetails;