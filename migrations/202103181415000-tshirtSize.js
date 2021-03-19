'use strict';
var back;
const vname = 'CountTshirtSizes';
const query = 'SELECT `coolestproject`.`TShirts`.`id` AS `id`,`coolestproject`.`TShirts`.`name` AS `name`,count(`coolestproject`.`Users`.`sizeId`) AS `count` from (`coolestproject`.`Users` join `coolestproject`.`TShirts`) where (`coolestproject`.`Users`.`sizeId` = `coolestproject`.`TShirts`.`id`) group by `coolestproject`.`Users`.`sizeId`';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query( `CREATE OR REPLACE VIEW ${vname} AS ${query}`,back);
  },
  
  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query( `DROP VIEW ${vname} `,back);
  }
}