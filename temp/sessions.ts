import { Model, DataTypes, Sequelize } from 'sequelize';

interface SessionsAttributes {
  sid: string;
  expires: Date | null;
  data: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface SessionsCreationAttributes extends Omit<SessionsAttributes, 'createdAt' | 'updatedAt'> {}

class Sessions extends Model<SessionsAttributes, SessionsCreationAttributes> {
  public sid!: string;
  public expires!: Date | null;
  public data!: string | null;
  public createdAt!: Date;
  public updatedAt!: Date;
}

export const initSessions = (sequelize: Sequelize) => {
  Sessions.init(
    {
      sid: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      expires: {
        type: DataTypes.DATE,
      },
      data: {
        type: DataTypes.STRING,
      },
      createdAt: {
        type: DataTypes.DATE,
      },
      updatedAt: {
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      modelName: 'Sessions',
      freezeTableName: true,
      timestamps: true, // Corrected to add createdAt and updatedAt fields
    }
  );
};