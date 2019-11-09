'use strict';
module.exports = (sequelize, DataTypes) => {
  const Registration = sequelize.define('Registration', {
    postalcode: DataTypes.INTEGER,
    email: DataTypes.STRING,
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
    birthmonth: DataTypes.DATEONLY,
    size: DataTypes.ENUM('s','m','l','xl','xxl','3xl'),
    type: DataTypes.ENUM('m', 'v'),
    via: DataTypes.STRING,
    medical: DataTypes.STRING,
    extra: DataTypes.STRING,
    project_code: DataTypes.UUID,
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
    email_guardian: DataTypes.STRING,
  }, {});
  Registration.associate = function(models) {
    // associations can be defined here
  };
  return Registration;
};
