module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('products', 'addiotionalInformation', 'additionalInformation');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('products', 'additionalInformation', 'addiotionalInformation');
  }
};
