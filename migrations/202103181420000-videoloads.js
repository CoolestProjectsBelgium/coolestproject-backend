'use strict';
var back;
const vname10 = 'videoloads';
const query10 = 'SELECT `coolestproject`.`Projects`.`id` AS `ProjectId`,`coolestproject`.`Projects`.`project_name` AS `project_name`,`coolestproject`.`Users`.`firstname` AS `firstname`,`coolestproject`.`Users`.`lastname` AS `lastname`,`coolestproject`.`Attachments`.`name` AS `VideoName`,`coolestproject`.`Projects`.`ownerId` AS `ownerId`,`coolestproject`.`Attachments`.`filename` AS `FileName` from ((`coolestproject`.`Projects` join `coolestproject`.`Attachments`) join `coolestproject`.`Users`) where ((`coolestproject`.`Projects`.`id` = `coolestproject`.`Attachments`.`ProjectId`) and (`coolestproject`.`Users`.`id` = `coolestproject`.`Projects`.`ownerId`)) order by `coolestproject`.`Users`.`lastname`'
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query( `CREATE OR REPLACE VIEW ${vname10} AS ${query10}`,back);
  },
  
  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query( `DROP VIEW ${vname10} `,back);
  }
}