'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Events', 'maxFileSize', { type: Sequelize.BIGINT(20) });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Events', 'maxFileSize');
  }
};
