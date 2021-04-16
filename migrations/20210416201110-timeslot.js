'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('ProjectTables', 'startTime', { type: Sequelize.DATE });
    await queryInterface.addColumn('ProjectTables', 'endTime', { type: Sequelize.DATE });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('ProjectTables', 'startTime');
    await queryInterface.removeColumn('ProjectTables', 'endTime');
  }
};
