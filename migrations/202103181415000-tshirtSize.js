'use strict';
var back;
const vname9 = 'tshirtsizes';
const query9 = 'SELECT `coolestproject`.`TShirts`.`id` AS `id`,`coolestproject`.`TShirts`.`name` AS `name`,count(`coolestproject`.`Users`.`sizeId`) AS `count` from (`coolestproject`.`Users` join `coolestproject`.`TShirts`) where (`coolestproject`.`Users`.`sizeId` = `coolestproject`.`TShirts`.`id`) group by `coolestproject`.`Users`.`sizeId`'
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query( `CREATE OR REPLACE VIEW ${vname9} AS ${query9}`,back);
  },
  
  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query( `DROP VIEW ${vname9} `,back);
  }
}