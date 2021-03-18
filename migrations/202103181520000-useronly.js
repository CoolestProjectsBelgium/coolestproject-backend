'use strict';
var back;
const vname7 = 'useronly';
const query7 = 'SELECT  `Users`.`id`,`Users`.`firstname`,`Users`.`lastname`,`Users`.`email` FROM `Users` WHERE NOT EXISTS (SELECT `Projects`.`ownerid` FROM `Projects` WHERE `Users`.`id` = `Projects`.`ownerid`) AND NOT EXISTS (SELECT `Vouchers`.`participantId` FROM `Vouchers` WHERE `Users`.`id` = `Vouchers`.`participantId`)';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query( `CREATE OR REPLACE VIEW ${vname7} AS ${query7}`,back);
  },
  
  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query( `DROP VIEW ${vname7} `,back);
  }
}
