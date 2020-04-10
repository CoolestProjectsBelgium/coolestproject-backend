'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Users', 'residence', Sequelize.STRING(254));
    await queryInterface.addColumn('Registrations', 'residence', Sequelize.STRING(254));
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Users', 'residence');
    await queryInterface.removeColumn('Registrations', 'residence');
  }
};
