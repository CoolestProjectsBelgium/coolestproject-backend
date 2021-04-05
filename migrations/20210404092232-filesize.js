'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Events', 'maxFileSize', { type: Sequelize.INTEGER(12) });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Events', 'maxFileSize');
  }
};
