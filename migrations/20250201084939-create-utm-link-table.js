'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('utmLinks', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      baseUrl: {
        type: Sequelize.STRING,
        allowNull: false
      },
      source: {
        type: Sequelize.STRING,
        allowNull: false
      },
      medium: {
        type: Sequelize.STRING,
        allowNull: false
      },
      campaign: {
        type: Sequelize.STRING,
        allowNull: false
      },
      utmUrl: {
        type: Sequelize.STRING,
        allowNull: false
      },
      couponCode: {
        type: Sequelize.STRING,
        allowNull: true
      },
      traffic: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      hasPurchase: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      status: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: true
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
    await queryInterface.dropTable('utmLinks');
  }
};
