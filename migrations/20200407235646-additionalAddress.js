'use strict';
// https://sequelize.org/master/class/lib/query-interface.js~QueryInterface.html
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Users', 'street', Sequelize.STRING(254));
    await queryInterface.addColumn('Users', 'house_number', Sequelize.STRING(20));
    await queryInterface.addColumn('Users', 'bus_number', Sequelize.STRING(20));
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Users', 'street');
    await queryInterface.removeColumn('Users', 'house_number');
    await queryInterface.removeColumn('Users', 'bus_number');
  }}
