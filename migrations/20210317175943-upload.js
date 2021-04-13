'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('AzureBlobs','size', Sequelize.BIGINT(20));
    await queryInterface.addColumn('Attachments', 'filename', Sequelize.STRING(255));
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('AzureBlobs','size', Sequelize.FLOAT(12, 9));
    await queryInterface.removeColumn('Attachments', 'filename');
  }
};
