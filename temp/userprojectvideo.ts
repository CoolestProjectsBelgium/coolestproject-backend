import { Model, DataTypes, Sequelize } from 'sequelize';

interface UserProjectVideoAttributes {
  project_descr: string;
  Youtube: string;
  EventID: string;
  ProjectID: string; // Use definite assignment assertion
  participants: string;
  Length: string;
  Language: string;
  Project_name: string;
}

interface UserProjectVideoCreationAttributes extends UserProjectVideoAttributes {}

class UserProjectVideo extends Model<UserProjectVideoAttributes, UserProjectVideoCreationAttributes> {
  public project_descr!: string; // Use definite assignment assertion
  public Youtube!: string; // Use definite assignment assertion
  public EventID!: string; // Use definite assignment assertion
  public ProjectID!: string; // Use definite assignment assertion
  public participants!: string; // Use definite assignment assertion
  public Length!: string; // Use definite assignment assertion
  public Language!: string; // Use definite assignment assertion
  public Project_name!: string; // Use definite assignment assertion
}

export const initUserProjectVideo = (sequelize: Sequelize) => {
  UserProjectVideo.init(
    {
      project_descr: {
        type: DataTypes.STRING,
      },
      Youtube: {
        type: DataTypes.STRING,
      },
      EventID: {
        type: DataTypes.STRING,
      },
      ProjectID: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      participants: {
        type: DataTypes.STRING,
      },
      Length: {
        type: DataTypes.STRING,
      },
      Language: {
        type: DataTypes.STRING,
      },
      Project_name: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: 'UserProjectVideo',
      freezeTableName: true,
      timestamps: false,
    }
  );
};

export default UserProjectVideo;
