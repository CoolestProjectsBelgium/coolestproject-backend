'use strict';
// https://sequelize.org/master/class/lib/query-interface.js~QueryInterface.html
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Users', 'internalu', Sequelize.STRING(1000));
    await queryInterface.addColumn('Projects', 'internalp', Sequelize.STRING(1000));
    await queryInterface.changeColumn('Users', 'general_questions', Sequelize.STRING(50));
    await queryInterface.changeColumn('Users', 'mandatory_approvals', Sequelize.STRING(10));
    await queryInterface.changeColumn('Registrations', 'general_questions', Sequelize.STRING(50));
    await queryInterface.changeColumn('Registrations', 'mandatory_approvals', Sequelize.STRING(10));
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Users', 'internalu');
    await queryInterface.removeColumn('Projects', 'internalp');
    await queryInterface.changeColumn('Users', 'general_questions', Sequelize.JSON);
    await queryInterface.changeColumn('Users', 'mandatory_approvals', Sequelize.JSON);
    await queryInterface.changeColumn('Registrations', 'general_questions', Sequelize.JSON);
    await queryInterface.changeColumn('Registrations', 'mandatory_approvals', Sequelize.JSON);
  }}