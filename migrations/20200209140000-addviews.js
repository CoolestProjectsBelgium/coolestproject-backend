'use strict';
// https://sequelize.org/master/class/lib/query-interface.js~QueryInterface.html
// https://sequelize.readthedocs.io/en/latest/docs/raw-queries/
// https://docs.google.com/spreadsheets/u/0/create?usp=sheets_home&ths=true
var back;
const vname1 = 'tshirtsizes';
const vname2 = 'sex';
const vname3 = 'taal';
const vname4 = 'UserProjectViewAll';
const vname5 = 'UserProjectView';
const vname6 = 'UserNames';

const query1 = 'SELECT `users`.`t_size` AS `t_shirt_sizes`,count(`users`.`t_size`) AS `nmbr` from `users` group by `users`.`t_size';
const query2 = 'SELECT `users`.`sex` AS `m_f`,count(`users`.`sex`) AS `total` from `users` group by `users`.`sex`';
const query3 = 'SELECT `users`.`language` AS `taal`,count(`users`.`language`) AS `total` from `users` group by  `users`.`language`';
const query4 = 'SELECT `projects`.`id` AS `p_id`,`projects`.`project_name` AS `project_name`,concat_ws(" ",`owner`.`firstname`,`owner`.`lastname`) AS `owner_name`,count(`vouchers`.`id`) AS `nmbr_voucher`,group_concat(concat_ws(" ",`participants`.`firstname`,`participants`.`lastname`) separator ",") AS `participants`,`projects`.`createdAt` AS `created_at` from (((`projects` join `users` `owner` on(`projects`.`ownerId` = `owner`.`id`)) left join `vouchers` on(`vouchers`.`projectId` = `projects`.`id`)) left join `users` `participants` on(`participants`.`id` = `vouchers`.`participantId`)) group by `projects`.`id`';
const query5 = 'SELECT `projects`.`id` AS `p_id`,`projects`.`project_name` AS `project_name`,concat_ws(" ",`owner`.`firstname`,`owner`.`lastname`) AS `owner_name`,count(`vouchers`.`id`) AS `nmbr_vouchers`,group_concat(concat_ws(" ",`participants`.`firstname`,`participants`.`lastname`) separator ",") AS `participants` from (((`projects` join `users` `owner` on(`projects`.`ownerId` = `owner`.`id`)) left join `vouchers` on(`vouchers`.`projectId` = `projects`.`id`)) left join `users` `participants` on(`participants`.`id` = `vouchers`.`participantId`)) where `vouchers`.`participantId` is not null group by `projects`.`id`';
const query6 = 'SELECT `users`.`email`,`users`.`firstname`,`users`.`lastname` from `users` order by `users`.`lastname`';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query( `CREATE OR REPLACE VIEW ${vname1} AS ${query1}`,back);
    await queryInterface.sequelize.query( `CREATE OR REPLACE VIEW ${vname2} AS ${query2}`,back);
    await queryInterface.sequelize.query( `CREATE OR REPLACE VIEW ${vname3} AS ${query3}`,back);
    await queryInterface.sequelize.query( `CREATE OR REPLACE VIEW ${vname4} AS ${query4}`,back);
    await queryInterface.sequelize.query( `CREATE OR REPLACE VIEW ${vname5} AS ${query5}`,back);
    await queryInterface.sequelize.query( `CREATE OR REPLACE VIEW ${vname6} AS ${query6}`,back);
  },
  
  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query( `DROP VIEW ${vname1} `,back);
    await queryInterface.sequelize.query( `DROP VIEW ${vname2} `,back);
    await queryInterface.sequelize.query( `DROP VIEW ${vname3} `,back);
    await queryInterface.sequelize.query( `DROP VIEW ${vname4} `,back);
    await queryInterface.sequelize.query( `DROP VIEW ${vname5} `,back);
    await queryInterface.sequelize.query( `DROP VIEW ${vname6} `,back);
  }
}

