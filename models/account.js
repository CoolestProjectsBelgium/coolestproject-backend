'use strict';

const bcrypt = require("bcrypt");
const logger = require('pino')()
const addYears = require('date-fns/addYears')
const addDays = require('date-fns/addDays')
const parseISO = require('date-fns/parseISO')

module.exports = (sequelize, DataTypes) => {
  const Account = sequelize.define('Account', {
    email: {
      type: DataTypes.STRING(100),
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      get() {
        return this.getDataValue('password')
      },
      set(password) {
        const salt = bcrypt.genSaltSync();
        const pwd = bcrypt.hashSync(password, salt);
        this.setDataValue('password', pwd)
      }
    },
    account_type: DataTypes.ENUM('super_admin', 'admin', 'jury')
  });
  Account.prototype.verifyPassword = async function (password) {
    return await bcrypt.compareSync(password, this.password);
  };
  return Account;
};
