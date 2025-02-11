module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('products', 'totalProducts', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0
    });
    await queryInterface.addColumn('products', 'remainingProduct', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('products', 'totalProducts');
    await queryInterface.removeColumn('products', 'remainingProduct');
  }
};
