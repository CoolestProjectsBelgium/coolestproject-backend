'use strict';
var back;
const vname = 'CountTshirtSizes';
const query = 'SELECT `TShirts`.`id` AS `id`,`TShirts`.`name` AS `name`,count(`Users`.`sizeId`) AS `count` from (`Users` join `TShirts`) where (`Users`.`sizeId` = `TShirts`.`id`) group by `Users`.`sizeId`';

module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query( `DROP TABLE IF EXISTS ${vname};`,back);
    await queryInterface.sequelize.query( `CREATE VIEW ${vname} AS ${query}`,back);
  },
  
  async down(queryInterface) {
    await queryInterface.sequelize.query( `DROP VIEW ${vname} `,back);
  }
};