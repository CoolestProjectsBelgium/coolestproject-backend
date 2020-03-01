'use strict';

const bcrypt = require("bcrypt");
const logger = require('pino')()
const addYears = require('date-fns/addYears')
const addDays = require('date-fns/addDays')
const parseISO = require('date-fns/parseISO')

module.exports = (sequelize, DataTypes) => {
  const Account = sequelize.define('Account', {
    username: {
        type: DataTypes.STRING(100),
        primaryKey: true
    },
    password: {
        type: DataTypes.STRING
    }
  }, {
    hooks: {
      beforeCreate: (user) => {
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync(user.password, salt);
      }
    },
    instanceMethods: {
      validPassword: function(password) {
        return bcrypt.compareSync(password, this.password);
      }
    }  
  });
  return Account;
};
