'use strict';
// https://sequelize.org/master/class/lib/query-interface.js~QueryInterface.html
// https://sequelize.readthedocs.io/en/latest/docs/raw-queries/
// https://docs.google.com/spreadsheets/u/0/create?usp=sheets_home&ths=true
var back;
const vname7 = 'useronly';
const query7 = 'SELECT  `users`.`id`,`users`.`firstname`,`users`.`lastname`,`users`.`email` FROM `users` WHERE NOT EXISTS (SELECT `projects`.`ownerid` FROM `projects` WHERE `users`.`id` = `projects`.`ownerid`) AND NOT EXISTS (SELECT `vouchers`.`participantId` FROM `vouchers` WHERE `users`.`id` = `vouchers`.`participantId`)';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query( `CREATE OR REPLACE VIEW ${vname7} AS ${query7}`,back);
  },
  
  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query( `DROP VIEW ${vname7} `,back);
  }
}

