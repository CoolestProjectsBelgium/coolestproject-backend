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

const query1 = 'SELECT `Users`.`t_size` AS `t_shirt_sizes`,count(`Users`.`t_size`) AS `nmbr` from `Users` group by `Users`.`t_size`';
const query2 = 'SELECT `Users`.`sex` AS `m_f`,count(`Users`.`sex`) AS `total` from `Users` group by `Users`.`sex`';
const query3 = 'SELECT `Users`.`language` AS `taal`,count(`Users`.`language`) AS `total` from `Users` group by  `Users`.`language`';
const query4 = 'SELECT `Projects`.`id` AS `p_id`,`Projects`.`project_name` AS `project_name`,concat_ws(" ",`owner`.`firstname`,`owner`.`lastname`) AS `owner_name`,count(`Vouchers`.`id`) AS `nmbr_voucher`,group_concat(concat_ws(" ",`Participants`.`firstname`,`Participants`.`lastname`) separator ",") AS `participants`,`Projects`.`createdAt` AS `created_at` from (((`Projects` join `Users` `owner` on(`Projects`.`ownerId` = `owner`.`id`)) left join `Vouchers` on(`Vouchers`.`projectId` = `Projects`.`id`)) left join `Users` `Participants` on(`Participants`.`id` = `Vouchers`.`participantId`)) group by `Projects`.`id`';
const query5 = 'SELECT `Projects`.`id` AS `p_id`,`Projects`.`project_name` AS `project_name`,concat_ws(" ",`owner`.`firstname`,`owner`.`lastname`) AS `owner_name`,count(`Vouchers`.`id`) AS `nmbr_vouchers`,group_concat(concat_ws(" ",`Participants`.`firstname`,`Participants`.`lastname`) separator ",") AS `participants` from (((`Projects` join `Users` `owner` on(`Projects`.`ownerId` = `owner`.`id`)) left join `Vouchers` on(`Vouchers`.`projectId` = `Projects`.`id`)) left join `Users` `Participants` on(`Participants`.`id` = `Vouchers`.`participantId`)) where `Vouchers`.`participantId` is not null group by `Projects`.`id`';
const query6 = 'SELECT `Users`.`email`,`Users`.`firstname`,`Users`.`lastname` from `Users` order by `Users`.`lastname`';

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

