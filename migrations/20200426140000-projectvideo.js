'use strict';
// https://sequelize.org/master/class/lib/query-interface.js~QueryInterface.html
// https://sequelize.readthedocs.io/en/latest/docs/raw-queries/
// https://docs.google.com/spreadsheets/u/0/create?usp=sheets_home&ths=true
var back;
const vname8 = 'userprojectvideo';
const query8 = 'SELECT `Projects`.`project_name` AS `project_name`,`Projects`.`id` AS `projectId`,`Projects`.`offset` AS `offset`,concat_ws(" ",`owner`.`firstname`,`owner`.`lastname`) AS `owner_name`,group_concat(concat_ws(" " ,`Participants`.`firstname`,`Participants`.`lastname`) separator ",") AS `participants`," " AS `youtube` from (((`Projects` join `Users` `owner` on(`Projects`.`ownerId` = `owner`.`id`)) left join `Vouchers` on(`Vouchers`.`projectId` = `Projects`.`id`)) left join `Users` `Participants` on(`Participants`.`id` = `Vouchers`.`participantId`)) group by `Projects`.`project_name`';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query( `CREATE OR REPLACE VIEW ${vname8} AS ${query8}`,back);
  },
  
  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query( `DROP VIEW ${vname8} `,back);
  }
}

