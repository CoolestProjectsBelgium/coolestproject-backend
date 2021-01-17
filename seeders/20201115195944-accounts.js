'use strict';

const dba = require('../dba');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Accounts', [
      { email: 'admin@coolestprojects.be', password: dba.generatePwd('admin'), account_type: 'admin', createdAt: new Date(), updatedAt: new Date() },
      { email: 'super@coolestprojects.be', password: dba.generatePwd('super'), account_type: 'super_admin', createdAt: new Date(), updatedAt: new Date() },
      { email: 'jury@coolestprojects.be', password: dba.generatePwd('jury'), account_type: 'jury', createdAt: new Date(), updatedAt: new Date() }
    ], {});
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Accounts', null, {});
  }
};
