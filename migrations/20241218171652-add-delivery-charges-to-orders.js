'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('order', 'deliveryCharges', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0.00,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('order', 'deliveryCharges');
  }
};
