'use strict';
module.exports = (sequelize, DataTypes) => {
  const Registration = sequelize.define('Registration', {
    postalcode: DataTypes.INTEGER,
    email: DataTypes.STRING,
    firstname: DataTypes.STRING,
    lastname: DataTypes.STRING,
    sex: DataTypes.ENUM('m', 'v', 'x'),
    general_questions_json: DataTypes.JSON,
    mandatory_approvals_json: DataTypes.JSON,
    birthmonth: DataTypes.DATEONLY,
    size: DataTypes.ENUM('s','m','l','xl','xxl','3xl'),
    type: DataTypes.ENUM('m', 'v'),
    via: DataTypes.STRING,
    medical: DataTypes.STRING,
    extra: DataTypes.STRING,
    project_code: DataTypes.UUID,
    project_name: DataTypes.STRING,
    project_descr: DataTypes.STRING,
    project_type: DataTypes.STRING,
    project_lang: DataTypes.ENUM('nl','fr','en'),
    gsm: DataTypes.STRING,
    gsm_guardian: DataTypes.STRING,
    email_guardian: DataTypes.STRING,
  }, {
    setterMethods: {
      general_questions(q){
        this.setDataValue('general_questions_json', JSON.stringify(q));
      },
      mandatory_approvals(q){
        this.setDataValue('general_questions_json', JSON.stringify(q));
      }
    },
    getterMethods: {
      general_questions(){
        console.log(this.general_questions_json);
        return JSON.parse(this.general_questions_json);
      },
      mandatory_approvals(){
        console.log(this.mandatory_approvals_json);
        return JSON.parse(this.mandatory_approvals_json);
      }
    }
  });
  Registration.associate = function(models) {
    // associations can be defined here
  };
  return Registration;
};
