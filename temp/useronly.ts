import { Model, DataTypes, Sequelize } from 'sequelize';

interface ShowUserWithNoProjectAttributes {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
}

class ShowUserWithNoProject extends Model<ShowUserWithNoProjectAttributes> {
  public id!: string;
  public firstname!: string;
  public lastname!: string;
  public email!: string;
}

export const initShowUserWithNoProject = (sequelize: Sequelize) => {
  ShowUserWithNoProject.init(
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      firstname: {
        type: DataTypes.STRING,
      },
      lastname: {
        type: DataTypes.STRING,
      },
      email: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: 'ShowUserWithNoProject',
      freezeTableName: true,
      timestamps: false,
    }
  );
};

export default ShowUserWithNoProject;
