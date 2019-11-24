'use strict';
module.exports = (sequelize, DataTypes) => {
  const Registration = sequelize.define('Registration', {
    postalcode: {
      type:  DataTypes.INTEGER,
      min: 1000,
      max: 9999
    },
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: true
      }
    }, 
    firstname: DataTypes.STRING,
    lastname: DataTypes.STRING,
    sex: DataTypes.ENUM('m', 'v', 'x'),
    general_questions: {
      type: DataTypes.JSON,
      get () {
        return JSON.parse(this.getDataValue('general_questions'));
      },
      set (value) {
        this.setDataValue('general_questions', JSON.stringify(value));
      }
    },
    mandatory_approvals: {
      type: DataTypes.JSON,
      get () {
        return JSON.parse(this.getDataValue('mandatory_approvals'));
      },
      set (value) {
        this.setDataValue('mandatory_approvals', JSON.stringify(value));
      }
    },
    birthmonth: {
      type: DataTypes.DATEONLY,
      isAfter: "2002-01-01",
      isBefore: "2015-01-01"
    },
    t_size: DataTypes.ENUM(
      'female_small','female_medium','female_large','female_xl','female_xxl','female_3xl',
      'male_small', 'male_medium', 'male_large', 'male_xl', 'male_xxl', 'male_3xl'
    ),
    via: DataTypes.STRING,
    medical: DataTypes.STRING,
    extra: DataTypes.STRING,
    project_code: {
      type: DataTypes.UUID,
      validate: {
        isUUID: 4
      }
    },
    project_name: DataTypes.STRING,
    project_descr: DataTypes.STRING,
    project_type: {
      type: DataTypes.JSON,
      get () {
        return JSON.parse(this.getDataValue('project_type'));
      },
      set (value) {
        this.setDataValue('project_type', JSON.stringify(value));
      }
    },
    project_lang: DataTypes.ENUM('nl','fr','en'),
    gsm: DataTypes.STRING,
    gsm_guardian: DataTypes.STRING,
    email_guardian: { 
      type: DataTypes.STRING,
      isEmail: true
    },
  }, {});
  Registration.associate = function(models) {
    // associations can be defined here
  };
  return Registration;
};
