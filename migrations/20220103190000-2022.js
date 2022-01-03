'use strict';
// https://sequelize.org/master/class/lib/query-interface.js~QueryInterface.html
// https://sequelize.readthedocs.io/en/latest/docs/raw-queries/
// https://docs.google.com/spreadsheets/u/0/create?usp=sheets_home&ths=true
var back;
const vname8 = 'userprojectvideo';
const query8 = 'select `p`.`project_name` AS `Project_Name`,`p`.`id` AS `ProjectID`,`p`.`eventId` AS `EventID`,concat(concat_ws(" ",`o`.`firstname`,`o`.`lastname`),concat(convert(convert(if((count(`pa`.`id`) > 0),", ","") using latin1) using utf8mb4),group_concat(concat_ws(" ",`pa`.`firstname`,`pa`.`lastname`) separator ", "))) AS `participants`,`href`.`Youtube` AS `Youtube`,`p`.`project_descr` AS `project_descr`,"3:00" AS `Length`,`p`.`project_lang` AS `Language` from ((((`coolestproject`.`Projects` `p` join `coolestproject`.`Users` `o` on((`o`.`id` = `p`.`ownerId`))) left join `coolestproject`.`Vouchers` `v` on(((`v`.`projectId` = `p`.`id`) and (`v`.`participantId` <> 0)))) left join `coolestproject`.`Users` `pa` on((`v`.`participantId` = `pa`.`id`))) join (select `p1`.`id` AS `ProjectId`,max(`ha`.`href`) AS `Youtube`,"3:00" AS `Length` from ((`coolestproject`.`Projects` `p1` left join `coolestproject`.`Attachments` `at` on((`at`.`ProjectId` = `p1`.`id`))) left join `coolestproject`.`Hyperlinks` `ha` on((`ha`.`AttachmentId` = `at`.`id`))) group by `p1`.`id`) `href` on((`href`.`ProjectId` = `p`.`id`))) group by `p`.`id`';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query( `CREATE OR REPLACE VIEW ${vname8} AS ${query8}`,back);
  },
  
  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query( `DROP VIEW ${vname8} `,back);
  }
};
