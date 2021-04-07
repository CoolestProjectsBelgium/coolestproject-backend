'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Events', 'maxFileSize', { type: Sequelize.BIGINT(20) });
    await queryInterface.addColumn('Events', 'closed', { type: Sequelize.BOOLEAN() });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Events', 'maxFileSize');
    await queryInterface.removeColumn('Events', 'closed');
  }
};
