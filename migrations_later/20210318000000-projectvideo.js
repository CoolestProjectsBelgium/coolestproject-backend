'use strict';
var back;
const vname8 = 'userprojectvideo';
const query8 = 'SELECT `p`.`id` AS `ProjectID`,`p`.`project_name` AS `project_name`,concat(concat_ws(" ",`o`.`firstname`,`o`.`lastname`),concat(if(count(`pa`.`id`) > 0,", ",""),group_concat(concat_ws(" ",`pa`.`firstname`,`pa`.`lastname`) separator ", "))) AS `participants`,`p`.`project_descr` AS `project_descr`,`p`.`max_tokens` AS `OFFSET`,`p`.`project_lang` AS `info` FROM (((`Projects` `p` join `Users` `o` on(`o`.`id` = `p`.`ownerId`)) left join `Vouchers` `v` on(`v`.`projectId` = `p`.`id` and `v`.`participantId` <> 0)) left join `Users` `pa` on(`v`.`participantId` = `pa`.`id`)) GROUP BY `p`.`id`'

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query( `CREATE OR REPLACE VIEW ${vname8} AS ${query8}`,back);
  },
  
  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query( `DROP VIEW ${vname8} `,back);
  }
}