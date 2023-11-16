import { DataTypes, Sequelize, Model } from 'sequelize';

interface ProjectUsersEmailAttributes {
  ProjectID: string;
  email: string;
  participants: string;
  Project_Name: string;
  project_descr: string;
  Language: string;
  eventId: string;
}

export class ShowProjectUsersEmail extends Model<ProjectUsersEmailAttributes> {
  public ProjectID!: string;
  public email!: string;
  public participants!: string;
  public Project_Name!: string;
  public project_descr!: string;
  public Language!: string;
  public eventId!: string;
}

export const initShowProjectUsersEmail = (sequelize: Sequelize) => {
  ShowProjectUsersEmail.init(
    {
      ProjectID: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      email: {
        type: DataTypes.STRING,
      },
      participants: {
        type: DataTypes.STRING,
      },
      Project_Name: {
        type: DataTypes.STRING,
      },
      project_descr: {
        type: DataTypes.STRING,
      },
      Language: {
        type: DataTypes.STRING,
      },
      eventId: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: 'ShowProjectUsersEmail',
      freezeTableName: true,
      timestamps: false,
    }
  );
};
