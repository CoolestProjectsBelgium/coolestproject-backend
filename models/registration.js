'use strict';
module.exports = (sequelize, DataTypes) => {
  const Registration = sequelize.define('Registration', {
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
        'female_M116','female_M122','female_M128','female_M134','female_M146','female_M152','female_M158','female_M164',
        'female_M170','female_M176','female_medium','female_large','female_xl','male_M116','male_M122','male_M128','male_M134',
        'male_M140','male_M146','male_M152','male_M158','male_M164','male_M170','male_M176','male_Xsmall','male_small',
        'male_medium','male_large','male_xl','male_xxl','male_3xl'        
      ),
      allowNull: false,
      validate: {
        isIn: [['female_M116','female_M122','female_M128','female_M134','female_M146','female_M152','female_M158','female_M164',
        'female_M170','female_M176','female_medium','female_large','female_xl','male_M116','male_M122','male_M128','male_M134',
        'male_M140','male_M146','male_M152','male_M158','male_M164','male_M170','male_M176','male_Xsmall','male_small',
        'male_medium','male_large','male_xl','male_xxl','male_3xl']]
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
      type: DataTypes.STRING(4000),
      defaultValue: null
    },
    project_type: {
      type: DataTypes.STRING(100),
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
          if (this.project_name === null || this.project_descr === null || this.project_lang === null) {
            throw new Error('You need a project token or a project');
          }
          // user joins existing project
        } else {
          if (this.project_name !== null || this.project_descr !== null || this.project_lang !== null) {
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
