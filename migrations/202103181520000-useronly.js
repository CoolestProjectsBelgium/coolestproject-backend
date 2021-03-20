'use strict';
var back;
const vname = 'ShowUserWithNoProject';
const query = 'SELECT  `Users`.`id`,`Users`.`firstname`,`Users`.`lastname`,`Users`.`email` FROM `Users` WHERE NOT EXISTS (SELECT `Projects`.`ownerid` FROM `Projects` WHERE `Users`.`id` = `Projects`.`ownerid`) AND NOT EXISTS (SELECT `Vouchers`.`participantId` FROM `Vouchers` WHERE `Users`.`id` = `Vouchers`.`participantId`)';

module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query( `DROP TABLE IF EXISTS ${vname};`,back);
    await queryInterface.sequelize.query( `CREATE OR REPLACE VIEW ${vname} AS ${query}`,back);
  },
  
  async down(queryInterface) {
    await queryInterface.sequelize.query( `DROP VIEW ${vname} `,back);
  }
};
