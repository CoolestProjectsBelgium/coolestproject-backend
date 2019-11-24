'use strict';
module.exports = (sequelize, DataTypes) => {
  const Registration = sequelize.define('Registration', {
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
      get() {
        return JSON.parse(this.getDataValue('general_questions'));
      },
      set(value) {
        this.setDataValue('general_questions', JSON.stringify(value));
      },
      validate: {
        isJSON(value) {
          try {
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
      get() {
        return JSON.parse(this.getDataValue('mandatory_approvals'));
      },
      set(value) {
        this.setDataValue('mandatory_approvals', JSON.stringify(value));
      },
      validate: {
        isJSON(value) {
          try {
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
        'female_small', 'female_medium', 'female_large', 'female_xl', 'female_xxl', 'female_3xl',
        'male_small', 'male_medium', 'male_large', 'male_xl', 'male_xxl', 'male_3xl'
      ),
      allowNull: false,
      validate: {
        isIn: [['female_small', 'female_medium', 'female_large', 'female_xl', 'female_xxl', 'female_3xl',
          'male_small', 'male_medium', 'male_large', 'male_xl', 'male_xxl', 'male_3xl']]
      }
    },
    via: DataTypes.STRING,
    medical: DataTypes.STRING,
    extra: DataTypes.STRING,
    project_code: {
      type: DataTypes.UUID,
      defaultValue: null
    },
    project_name: {
      type: DataTypes.STRING(100),
      defaultValue: null
    },
    project_descr: {
      type: DataTypes.STRING(500),
      defaultValue: null
    },
    project_type: {
      type: DataTypes.JSON,
      get() {
        return JSON.parse(this.getDataValue('project_type'));
      },
      set(value) {
        this.setDataValue('project_type', JSON.stringify(value));
      },
      defaultValue: null
    },
    project_lang: {
      type: DataTypes.ENUM('nl', 'fr', 'en'),
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
    },
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
      projectOrVoucher() {
        // user had own project
        if (this.project_code === null) {
          if (this.project_name === null || this.project_descr === null || this.project_lang === null || this.project_type === null) {
            throw new Error('You need a project token or a project');
          }
          // user joins existing project
        } else {
          if (this.project_name !== null || this.project_descr !== null || this.project_lang !== null || this.project_type !== null) {
            throw new Error('You need a project token or a project');
          }
        }
      }
    }
  });
  Registration.associate = function (models) {
    // associations can be defined here
  };
  return Registration;
};
