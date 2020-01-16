'use strict';

const logger = require('pino')()
const addYears = require('date-fns/addYears')
const addDays = require('date-fns/addDays')
const parseISO = require('date-fns/parseISO')

logger.debug('isAfter: ' + addDays(addYears(parseISO(process.env.START_DATE), -1 * process.env.MAX_AGE), -1).toISOString().substr(0, 10))
logger.debug('isBefore: ' + addDays(addYears(parseISO(process.env.START_DATE), -1 * process.env.MIN_AGE), 1).toISOString().substr(0, 10))

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
      type:  DataTypes.INTEGER,
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
      defaultValue: null
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
      type: DataTypes.JSON,
      get () {
        return JSON.parse(this.getDataValue('general_questions'));
      },
      set (value) {
        this.setDataValue('general_questions', JSON.stringify(value));
      },
      validate: {
        isJSON(value) {
          try{
            JSON.parse(value);
          } catch (error) {
            throw new Error('JSON is not valid');
          }
        }
      }
    },
    mandatory_approvals: {
      allowNull: false,
      type: DataTypes.JSON,
      get () {        
        return JSON.parse(this.getDataValue('mandatory_approvals'));
      },
      set (value) {
        this.setDataValue('mandatory_approvals', JSON.stringify(value));
      },
      validate: {
        isJSON(value) {
          try{
            JSON.parse(value);
          } catch (error) {
            throw new Error('JSON is not valid');
          }
        }
      }
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
    t_size: {
      type: DataTypes.ENUM(
        'female_M116','female_M122','female_M128','female_M134','female_M146','female_M152','female_M158','female_M164',
        'female_M170','female_M176','female_medium','female_large','female_xl','male_M116','male_M122','male_M128','male_M134',
        'male_M140','male_M146','male_M152','male_M158','male_M164','male_M170','male_M176','male_Xsmall','male_small',
        'male_medium','male_large','male_xl','male_xxl','male_3xl', 'kid_3/4' , 'kid_5/6', 'kid_7/8', 'kid_7/8', 
        'kid_9/11', 'kid_12/14', 'male_4xl', 'male_5xl', 'female_2xl', 'female_3xl'  
      ),
      allowNull: false,
      validate: {
        isIn: [['kid_3/4' , 'kid_5/6', 'kid_7/8', 'kid_7/8', 'kid_9/11', 'kid_12/14', 'female_medium','female_large',
          'female_xl','female_2xl','female_3xl', 'male_Xsmall','male_small', 'male_medium','male_large','male_xl','male_xxl','male_3xl','male_4xl','male_5xl']]
      }
    },
    via: DataTypes.STRING,
    medical: DataTypes.STRING,    
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
    },
  }, {
    validate: {
      hasGSM(){
        if(this.gsm === null && this.gsm_guardian === null){
          throw new Error('GSM or GSM Guardian is required')
        }
      },
      hasEmail(){
        if(this.email_guardian === null && this.email === null){
          throw new Error('Email or Email Guardian is required')
        }
      },
      guardianRequirement() {
        const minGuardian = addYears(parseISO(process.env.START_DATE), -1 * process.env.GUARDIAN_AGE)
        console.log("minGuardian:"+minGuardian+"this.birthmonth:"+parseISO(this.birthmonth))
        // check if guardian information is filled in
        if (minGuardian < parseISO(this.birthmonth)) { 
          if ( this.gsm_guardian === null || this.email_guardian === null ){
            throw new Error('You need guardian information');
          }
        }
      }
    }
  });
  User.associate = function(models) {
    User.hasOne(models.Project, { as: 'project', foreignKey : 'ownerId' }); 
    User.belongsToMany(models.Project, { as: 'participant', 
      through: { 
        model: models.Voucher, 
        unique: false},
        foreignKey: 'participantId',
        otherKey: 'projectId' 
      });
  };
  return User;
};
