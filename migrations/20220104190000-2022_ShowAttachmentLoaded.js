'use strict';
// https://sequelize.org/master/class/lib/query-interface.js~QueryInterface.html
// https://sequelize.readthedocs.io/en/latest/docs/raw-queries/
// https://docs.google.com/spreadsheets/u/0/create?usp=sheets_home&ths=true
var back;
const vname9 = 'ShowAttachmentLoaded';
const query9 = 'select `Projects`.`id` AS `ProjectId`,`Projects`.`eventId` AS `EventId`,`Projects`.`project_name` AS `project_name`,`Users`.`firstname` AS `firstname`,`Users`.`lastname` AS `lastname`,`Attachments`.`name` AS `VideoName`,`Projects`.`ownerId` AS `ownerId`,`Attachments`.`filename` AS `FileName` from ((`Projects` join `Attachments`) join `Users`) where ((`Projects`.`id` = `Attachments`.`ProjectId`) and (`Users`.`id` = `Projects`.`ownerId`)) order by `Users`.`lastname`';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query( `DROP TABLE IF EXISTS ${vname9};`,back);
    await queryInterface.sequelize.query( `CREATE OR REPLACE VIEW ${vname9} AS ${query9}`,back);
  },
  
  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query( `DROP VIEW ${vname9} `,back);
  }
};
