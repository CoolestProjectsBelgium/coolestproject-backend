'use strict';
var back;
const vname = 'userprojectvideo';
const query = 'SELECT `p`.`id` AS `ProjectID`,`p`.`project_name` AS `project_name`,concat(concat_ws(" ",`o`.`firstname`,`o`.`lastname`),concat(if(count(`pa`.`id`) > 0,", ",""),group_concat(concat_ws(" ",`pa`.`firstname`,`pa`.`lastname`) separator ", "))) AS `participants`,`p`.`project_descr` AS `project_descr`,`p`.`max_tokens` AS `OFFSET`,`p`.`project_lang` AS `info` FROM (((`Projects` `p` join `Users` `o` on(`o`.`id` = `p`.`ownerId`)) left join `Vouchers` `v` on(`v`.`projectId` = `p`.`id` and `v`.`participantId` <> 0)) left join `Users` `pa` on(`v`.`participantId` = `pa`.`id`)) GROUP BY `p`.`id`';

module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query( `DROP TABLE IF EXISTS ${vname};`,back);
    await queryInterface.sequelize.query( `CREATE OR REPLACE VIEW ${vname} AS ${query}`,back);
  },
  
  async down(queryInterface) {
    await queryInterface.sequelize.query( `DROP VIEW ${vname} `,back);
  }
};