'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('AzureBlob','size', { type: Sequelize.INTEGER(12) });
    await queryInterface.addColumn('Attachment', 'filename', Sequelize.STRING(255));
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('AzureBlob','size', { type: Sequelize.FLOAT(12, 9) });
    await queryInterface.removeColumn('Attachment', 'filename');
  }
};
