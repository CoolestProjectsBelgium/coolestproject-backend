'use strict';
// https://sequelize.org/master/class/lib/query-interface.js~QueryInterface.html
// https://sequelize.readthedocs.io/en/latest/docs/raw-queries/
var back;
const view_name = 'testmy_view';
const query = 'SELECT `2020coolestproject`.`users`.`t_size` AS `t_shirt_sizes`,count(`2020coolestproject`.`users`.`t_size`) AS `nmbr` from `2020coolestproject`.`users` group by `2020coolestproject`.`users`.`t_size';
module.exports = {
  up: function(sequelize, Sequelize) {
    return sequelize.query( `CREATE ALGORITHM=UNDEFINED DEFINER=root@localhost SQL SECURITY DEFINER VIEW ${view_name} AS ${query}`,back);
  },
  
  down: function(sequelize, Sequelize) {
    return sequelize.query( `DROP VIEW ${view_name} `,back);
  }
}

// https://docs.google.com/spreadsheets/u/0/create?usp=sheets_home&ths=true