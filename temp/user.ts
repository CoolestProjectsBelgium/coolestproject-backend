import { Model, DataTypes, Sequelize } from 'sequelize';

interface UserAttributes {
  language: 'nl' | 'fr' | 'en';
  postalcode?: number;
  municipality_name?: string;
  street?: string;
  house_number?: string;
  box_number?: string;
  email: string;
  firstname: string;
  lastname: string;
  sex: 'm' | 'f' | 'x';
  birthmonth: Date;
  last_token?: Date;
  via?: string;
  medical?: string | null;
  gsm?: string | null;
  gsm_guardian?: string | null;
  internalinfo?: string | null;
  email_guardian?: string | null;
}

export class User extends Model<UserAttributes> {
  public language!: 'nl' | 'fr' | 'en';
  public postalcode?: number;
  public municipality_name?: string;
  public street?: string;
  public house_number?: string;
  public box_number?: string;
  public email!: string;
  public firstname!: string;
  public lastname!: string;
  public sex!: 'm' | 'f' | 'x';
  public birthmonth!: Date;
  public last_token?: Date;
  public via?: string;
  public medical?: string | null;
  public gsm?: string | null;
  public gsm_guardian?: string | null;
  public internalinfo?: string | null;
  public email_guardian?: string | null;
}

export const init = (sequelize: Sequelize) => {
  User.init(
    {
      language: {
        type: DataTypes.ENUM('nl', 'fr', 'en'),
        allowNull: false,
        validate: { isIn: [['nl', 'fr', 'en']] },
      },
      postalcode: {
        type: DataTypes.INTEGER,
        validate: { min: 1000, max: 9999 },
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
      email: {
        type: DataTypes.STRING(254),
        validate: { isEmail: true },
        allowNull: false,
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
        validate: { isIn: [['m', 'f', 'x']] },
      },
      birthmonth: {
        allowNull: false,
        type: DataTypes.DATEONLY,
      },
      last_token: {
        allowNull: true,
        type: DataTypes.DATE,
      },
      via: {
        type: DataTypes.STRING(255),
      },
      medical: {
        type: DataTypes.STRING(255),
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
      internalinfo: {
        type: DataTypes.STRING(2000),
        defaultValue: null,
      },
      email_guardian: {
        type: DataTypes.STRING(254),
        validate: { isEmail: true },
        defaultValue: null,
      },
    },
    {
      sequelize,
      modelName: 'User',
      indexes: [{ unique: true, fields: ['email', 'eventId'] }],
    }
  );
}
