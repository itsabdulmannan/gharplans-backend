'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.addColumn('products', 'dimension_temp', {
        type: Sequelize.JSONB,
        allowNull: true,
      }, { transaction });

      await queryInterface.sequelize.query(
        `UPDATE "products" SET "dimension_temp" = to_jsonb("dimension"::text)`,
        { transaction }
      );

      await queryInterface.removeColumn('products', 'dimension', { transaction });

      await queryInterface.renameColumn('products', 'dimension_temp', 'dimension', { transaction });
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.addColumn('products', 'dimension_temp', {
        type: Sequelize.STRING,
        allowNull: true,
      }, { transaction });

      await queryInterface.sequelize.query(
        `UPDATE "products" SET "dimension_temp" = "dimension"::text`,
        { transaction }
      );

      await queryInterface.removeColumn('products', 'dimension', { transaction });

      await queryInterface.renameColumn('products', 'dimension_temp', 'dimension', { transaction });
    });
  }
};
