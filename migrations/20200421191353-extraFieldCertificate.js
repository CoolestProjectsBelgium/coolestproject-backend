'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Projects', 'certificate', Sequelize.STRING(1000));
    await queryInterface.addColumn('Projects', 'offset', Sequelize.INTEGER);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Projects', 'certificate');
    await queryInterface.addColumn('Projects', 'offset',  Sequelize.INTEGER);
  }
};
