'use strict';

const bcrypt = require("bcrypt");
const logger = require('pino')()
const addYears = require('date-fns/addYears')
const addDays = require('date-fns/addDays')
const parseISO = require('date-fns/parseISO')

module.exports = (sequelize, DataTypes) => {
  const Table = sequelize.define('Table', {
    tableNumber: {
        type: DataTypes.INTEGER,
        unique: true
    }
  },{});
  Table.associate = function(models) {
    Table.belongsTo(models.Project, { as: 'project' });
  };
  return Table;
};
