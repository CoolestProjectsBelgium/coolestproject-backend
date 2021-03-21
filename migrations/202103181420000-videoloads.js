'use strict';
var back;
const vname = 'ShowAttachmentLoaded';
const query = 'SELECT `Projects`.`id` AS `ProjectId`,`Projects`.`project_name` AS `project_name`,`Users`.`firstname` AS `firstname`,`Users`.`lastname` AS `lastname`,`Attachments`.`name` AS `VideoName`,`Projects`.`ownerId` AS `ownerId`,`Attachments`.`filename` AS `FileName` from ((`Projects` join `Attachments`) join `Users`) where ((`Projects`.`id` = `Attachments`.`ProjectId`) and (`Users`.`id` = `Projects`.`ownerId`)) order by `Users`.`lastname`';

module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query( `DROP TABLE IF EXISTS ${vname};`,back);
    await queryInterface.sequelize.query( `CREATE OR REPLACE VIEW ${vname} AS ${query}`,back);
  },
  
  async down(queryInterface) {
    await queryInterface.sequelize.query( `DROP VIEW ${vname} `,back);
  }
};