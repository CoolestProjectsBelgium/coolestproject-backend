'use strict';
var back;
const vname = 'ShowAttachmentLoaded';
const query = 'SELECT `coolestproject`.`Projects`.`id` AS `ProjectId`,`coolestproject`.`Projects`.`project_name` AS `project_name`,`coolestproject`.`Users`.`firstname` AS `firstname`,`coolestproject`.`Users`.`lastname` AS `lastname`,`coolestproject`.`Attachments`.`name` AS `VideoName`,`coolestproject`.`Projects`.`ownerId` AS `ownerId`,`coolestproject`.`Attachments`.`filename` AS `FileName` from ((`coolestproject`.`Projects` join `coolestproject`.`Attachments`) join `coolestproject`.`Users`) where ((`coolestproject`.`Projects`.`id` = `coolestproject`.`Attachments`.`ProjectId`) and (`coolestproject`.`Users`.`id` = `coolestproject`.`Projects`.`ownerId`)) order by `coolestproject`.`Users`.`lastname`';

module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query( `DROP TABLE IF EXISTS ${vname};`,back);
    await queryInterface.sequelize.query( `CREATE OR REPLACE VIEW ${vname} AS ${query}`,back);
  },
  
  async down(queryInterface) {
    await queryInterface.sequelize.query( `DROP VIEW ${vname} `,back);
  }
};