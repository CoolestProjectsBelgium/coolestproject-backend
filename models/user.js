'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
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
      type: DataTypes.ENUM('m', 'v', 'x'),
      allowNull: false,
      validate: {
        isIn: [['m', 'v', 'x']]
      }
    },
    general_questions: {
      type: DataTypes.JSON,
      get () {
        //todo: try to understand why it is undefined in some cases
        var general_questions = this.getDataValue('general_questions')
        if(general_questions === undefined){
          return general_questions;
        }
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
        //todo: try to understand why it is undefined in some cases
        var mandatory_approvals = this.getDataValue('mandatory_approvals')
        if(mandatory_approvals === undefined){
          return mandatory_approvals;
        }        
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
        isAfter: "2002-01-01",
        isBefore: "2015-01-01"
      }
    },
    t_size: {
      type: DataTypes.ENUM(
        'female_small','female_medium','female_large','female_xl','female_xxl','female_3xl',
        'male_small', 'male_medium', 'male_large', 'male_xl', 'male_xxl', 'male_3xl'
      ),
      allowNull: false,
      validate: {
        isIn: [['female_small','female_medium','female_large','female_xl','female_xxl','female_3xl',
          'male_small', 'male_medium', 'male_large', 'male_xl', 'male_xxl', 'male_3xl']]
      }
    },
    via: DataTypes.STRING,
    medical: DataTypes.STRING,
    extra: DataTypes.STRING,    
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
