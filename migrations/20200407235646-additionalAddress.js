'use strict';
// https://sequelize.org/master/class/lib/query-interface.js~QueryInterface.html
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Users', 'street', Sequelize.STRING(254));
    await queryInterface.addColumn('Users', 'house_number', Sequelize.STRING(20));
    await queryInterface.addColumn('Users', 'bus_number', Sequelize.STRING(20));

    await queryInterface.addColumn('Projects', 'info', Sequelize.ENUM('movie_received'));

    await queryInterface.addColumn('Registrations', 'street', Sequelize.STRING(254));
    await queryInterface.addColumn('Registrations', 'house_number', Sequelize.STRING(20));
    await queryInterface.addColumn('Registrations', 'bus_number', Sequelize.STRING(20));
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Users', 'street');
    await queryInterface.removeColumn('Users', 'house_number');
    await queryInterface.removeColumn('Users', 'bus_number');

    await queryInterface.removeColumn('Registrations', 'street');
    await queryInterface.removeColumn('Registrations', 'house_number');
    await queryInterface.removeColumn('Registrations', 'bus_number');

    await queryInterface.removeColumn('Projects', 'info');

  }}
