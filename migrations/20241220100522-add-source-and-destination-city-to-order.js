'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('order', 'sourceCity', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('order', 'destinationCity', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('order', 'sourceCity');
    await queryInterface.removeColumn('order', 'destinationCity');
  }
};
