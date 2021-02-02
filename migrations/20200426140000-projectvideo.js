'use strict';
// https://sequelize.org/master/class/lib/query-interface.js~QueryInterface.html
// https://sequelize.readthedocs.io/en/latest/docs/raw-queries/
// https://docs.google.com/spreadsheets/u/0/create?usp=sheets_home&ths=true
var back;
const vname8 = 'userprojectvideo';
const query8 = 'SELECT `p`.`id` AS `ProjectID`,`p`.`project_name` AS `project_name`,concat(concat_ws(" ",`o`.`firstname`,`o`.`lastname`),concat(if(count(`pa`.`id`) > 0,", ",""),group_concat(concat_ws(" ",`pa`.`firstname`,`pa`.`lastname`) separator ", "))) AS `participants`,`p`.`project_descr` AS `project_descr`,`p`.`offset` AS `OFFSET`,`p`.`info` AS `info` FROM (((`projects` `p` join `users` `o` on(`o`.`id` = `p`.`ownerId`)) left join `vouchers` `v` on(`v`.`projectId` = `p`.`id` and `v`.`participantId` <> 0)) left join `users` `pa` on(`v`.`participantId` = `pa`.`id`)) GROUP BY `p`.`id`'

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query( `CREATE OR REPLACE VIEW ${vname8} AS ${query8}`,back);
  },
  
  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query( `DROP VIEW ${vname8} `,back);
  }
}

