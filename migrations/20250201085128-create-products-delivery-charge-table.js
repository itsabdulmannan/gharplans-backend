'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('products_delivery_charge', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      productId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      sourceCityId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      destinationCityId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      deliveryCharge: {
        type: Sequelize.DECIMAL,
        allowNull: false
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('products_delivery_charge');
  }
};
