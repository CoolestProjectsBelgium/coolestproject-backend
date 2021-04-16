'use strict';
var back;
const vname = 'userprojectvideo';
//const queryx = 'SELECT `p`.`id` AS `ProjectID`,`p`.`project_name` AS `project_name`,concat(concat_ws(" ",`o`.`firstname`,`o`.`lastname`),concat(if(count(`pa`.`id`) > 0,", ",""),group_concat(concat_ws(" ",`pa`.`firstname`,`pa`.`lastname`) separator ", "))) AS `participants`,`p`.`project_descr` AS `project_descr`,`p`.`max_tokens` AS `OFFSET`,`p`.`project_lang` AS `info` FROM (((`Projects` `p` join `Users` `o` on(`o`.`id` = `p`.`ownerId`)) left join `Vouchers` `v` on(`v`.`projectId` = `p`.`id` and `v`.`participantId` <> 0)) left join `Users` `pa` on(`v`.`participantId` = `pa`.`id`)) GROUP BY `p`.`id`';
const query = 'select `p`.`project_name` AS `Project_Name`,`p`.`id` AS `ProjectID`,concat(concat_ws(" ",`o`.`firstname`,`o`.`lastname`),concat(convert(convert(if((count(`pa`.`id`) > 0),", ","") using latin1) using utf8mb4),group_concat(concat_ws(" ",`pa`.`firstname`,`pa`.`lastname`) separator ", "))) AS `participants`,`href`.`Youtube` AS `Youtube`,`p`.`project_descr` AS `project_descr`,"3:00" AS `Length`,`p`.`project_lang` AS `Language` from ((((`Projects` `p` join `Users` `o` on((`o`.`id` = `p`.`ownerId`))) left join `Vouchers` `v` on(((`v`.`projectId` = `p`.`id`) and (`v`.`participantId` <> 0)))) left join `Users` `pa` on((`v`.`participantId` = `pa`.`id`))) join (select `p1`.`id` AS `ProjectId`,max(`ha`.`href`) AS `Youtube`,"3:00" AS `Length` from ((`Projects` `p1` left join `Attachments` `at` on((`at`.`ProjectId` = `p1`.`id`))) left join `Hyperlinks` `ha` on((`ha`.`AttachmentId` = `at`.`id`))) group by `p1`.`id`) `href` on((`href`.`ProjectId` = `p`.`id`))) group by `p`.`id`';


module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query( `DROP TABLE IF EXISTS ${vname};`,back);
    await queryInterface.sequelize.query( `CREATE OR REPLACE VIEW ${vname} AS ${query}`,back);
  },
  
  async down(queryInterface) {
    await queryInterface.sequelize.query( `DROP VIEW ${vname} `,back);
  }
};