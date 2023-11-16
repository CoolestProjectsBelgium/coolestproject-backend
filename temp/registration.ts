import { Model, DataTypes, Sequelize, Optional, Op } from 'sequelize';

//import { sequelize } from './index.js'

interface RegistrationAttributes {
  language: 'nl' | 'fr' | 'en';
  email: string | null;
  firstname: string;
  lastname: string;
  sex: 'm' | 'f' | 'x';
  birthmonth: Date;
  via: string | null;
  medical: string | null;
  project_code: string | null;
  waiting_list: boolean;
  internalinfo: string | null;
  project_name: string | null;
  project_descr: string | null;
  project_type: string | null;
  project_lang: 'nl' | 'fr' | 'en' | null;
  gsm: string | null;
  gsm_guardian: string | null;
  email_guardian: string | null;
  postalcode: number | null;
  municipality_name: string;
  street: string;
  house_number: string;
  box_number: string;
  max_tokens: number | null;
}

export class Registration extends Model<RegistrationAttributes> {
  public language!: 'nl' | 'fr' | 'en';
  public email!: string | null;
  public firstname!: string;
  public lastname!: string;
  public sex!: 'm' | 'f' | 'x';
  public birthmonth!: Date;
  public via!: string | null;
  public medical!: string | null;
  public project_code!: string | null;
  public waiting_list!: boolean;
  public internalinfo!: string | null;
  public project_name!: string | null;
  public project_descr!: string | null;
  public project_type!: string | null;
  public project_lang!: 'nl' | 'fr' | 'en' | null;
  public gsm!: string | null;
  public gsm_guardian!: string | null;
  public email_guardian!: string | null;
  public postalcode!: number | null;
  public municipality_name!: string;
  public street!: string;
  public house_number!: string;
  public box_number!: string;
  public max_tokens!: number | null;
}

export const init = (sequelize: Sequelize) => {
  Registration.init(
    {
      language: {
        type: DataTypes.ENUM('nl', 'fr', 'en'),
        allowNull: false,
        validate: {
          isIn: [['nl', 'fr', 'en']],
        },
      },
      email: {
        type: DataTypes.STRING(254),
        validate: {
          isEmail: true,
        },
        defaultValue: null,
      },
      firstname: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastname: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      sex: {
        type: DataTypes.ENUM('m', 'f', 'x'),
        allowNull: false,
        validate: {
          isIn: [['m', 'f', 'x']],
        },
      },
      birthmonth: {
        allowNull: false,
        type: DataTypes.DATEONLY,
      },
      via: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
      medical: {
        type: DataTypes.STRING(255),
        defaultValue: null,
      },
      project_code: {
        type: DataTypes.UUID,
        defaultValue: null,
      },
      waiting_list: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      internalinfo: {
        type: DataTypes.STRING(2000),
        allowNull: true,
      },
      project_name: {
        type: DataTypes.STRING(100),
        defaultValue: null,
      },
      project_descr: {
        type: DataTypes.STRING(4000),
        defaultValue: null,
      },
      project_type: {
        type: DataTypes.STRING(100),
        defaultValue: null,
      },
      project_lang: {
        type: DataTypes.ENUM('nl', 'fr', 'en'),
        defaultValue: null,
      },
      gsm: {
        type: DataTypes.STRING(13),
        defaultValue: null,
      },
      gsm_guardian: {
        type: DataTypes.STRING(13),
        defaultValue: null,
      },
      email_guardian: {
        type: DataTypes.STRING(254),
        defaultValue: null,
        validate: {
          isEmail: true,
        },
      },
      postalcode: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      municipality_name: {
        type: DataTypes.STRING(30),
      },
      street: {
        type: DataTypes.STRING(100),
      },
      house_number: {
        type: DataTypes.STRING(20),
      },
      box_number: {
        type: DataTypes.STRING(20),
      },
      max_tokens: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'Registration',
      indexes: [{ unique: true, fields: ['email', 'eventId'] }],
    }
  );
}
//Registration.belongsTo(models.TShirt);
//Registration.belongsTo(models.Event);
//Registration.hasMany(models.QuestionRegistration);