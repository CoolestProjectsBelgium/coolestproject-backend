'use strict';

const logger = require('pino')()
const addYears = require('date-fns/addYears')
const addDays = require('date-fns/addDays')
const parseISO = require('date-fns/parseISO')

logger.debug('isAfter: ' + addDays(addYears(parseISO(process.env.START_DATE), -1 * process.env.MAX_AGE), -1).toISOString().substr(0, 10))
logger.debug('isBefore: ' + addDays(addYears(parseISO(process.env.START_DATE), -1 * process.env.MIN_AGE), 1).toISOString().substr(0, 10))

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    language: {
      type: DataTypes.ENUM('nl', 'fr', 'en'),
      allowNull: false,
      validate: {
        isIn: [['nl', 'fr', 'en']]
      }
    },
    postalcode: {
      type: DataTypes.INTEGER,
      validate: {
        min: 1000,
        max: 9999,
      },
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(254),
      validate: {
        isEmail: true
      },
      defaultValue: null,
      unique: true
    },
    firstname: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: false
    },
    sex: {
      type: DataTypes.ENUM('m', 'f', 'x'),
      allowNull: false,
      validate: {
        isIn: [['m', 'f', 'x']]
      }
    },
    general_questions: {
      type: DataTypes.JSON
    },
    mandatory_approvals: {
      allowNull: false,
      type: DataTypes.JSON
    },
    birthmonth: {
      allowNull: false,
      type: DataTypes.DATEONLY,
      validate: {
        isAfter: addDays(addYears(parseISO(process.env.START_DATE), -1 * process.env.MAX_AGE), -1).toISOString().substr(0, 10),
        isBefore: addDays(addYears(parseISO(process.env.START_DATE), -1 * process.env.MIN_AGE), 1).toISOString().substr(0, 10)
      }
    },
    last_token: {
      allowNull: true,
      type: DataTypes.DATE
    },
    via: DataTypes.STRING,
    medical: {
      type: DataTypes.STRING(255),
      defaultValue: null
    },
    gsm: {
      type: DataTypes.STRING(13),
      defaultValue: null
    },
    gsm_guardian: {
      type: DataTypes.STRING(13),
      defaultValue: null
    },
    email_guardian: {
      type: DataTypes.STRING(254),
      isEmail: true,
      defaultValue: null,
    }
  }, {
    validate: {
      hasGSM() {
        if (this.gsm === null && this.gsm_guardian === null) {
          throw new Error('GSM or GSM Guardian is required')
        }
      },
      hasEmail() {
        if (this.email_guardian === null && this.email === null) {
          throw new Error('Email or Email Guardian is required')
        }
      },
      guardianRequirement() {
        const minGuardian = addYears(parseISO(process.env.START_DATE), -1 * process.env.GUARDIAN_AGE)
        console.log("minGuardian:" + minGuardian + "this.birthmonth:" + parseISO(this.birthmonth))
        // check if guardian information is filled in
        if (minGuardian < parseISO(this.birthmonth)) {
          if (this.gsm_guardian === null || this.email_guardian === null) {
            throw new Error('You need guardian information');
          }
        }
      }
    }
  });
  User.associate = function (models) {
    User.hasOne(models.Project, { as: 'project', foreignKey: 'ownerId' });
    User.belongsToMany(models.Project, {
      as: 'participant',
      through: {
        model: models.Voucher,
        unique: false
      },
      foreignKey: 'participantId',
      otherKey: 'projectId'
    });
    User.belongsTo(models.TShirt, { as: 'size', optional: false });
  };
  return User;
};
