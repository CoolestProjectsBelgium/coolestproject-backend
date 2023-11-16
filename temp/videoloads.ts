import { Model, DataTypes, Sequelize } from 'sequelize';

interface ShowAttachmentLoadedAttributes {
  ProjectId: string; // Use definite assignment assertion
  ownerId: string;
  FileName: string;
  firstname: string;
  lastname: string;
  VideoName: string;
  EventId: string;
  project_name: string;
}

interface ShowAttachmentLoadedCreationAttributes extends ShowAttachmentLoadedAttributes {}

class ShowAttachmentLoaded extends Model<ShowAttachmentLoadedAttributes, ShowAttachmentLoadedCreationAttributes> {
  public ProjectId!: string; // Use definite assignment assertion
  public ownerId!: string; // Use definite assignment assertion
  public FileName!: string; // Use definite assignment assertion
  public firstname!: string; // Use definite assignment assertion
  public lastname!: string; // Use definite assignment assertion
  public VideoName!: string; // Use definite assignment assertion
  public EventId!: string; // Use definite assignment assertion
  public project_name!: string; // Use definite assignment assertion
}

export const initShowAttachmentLoaded = (sequelize: Sequelize) => {
  ShowAttachmentLoaded.init(
    {
      ProjectId: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      ownerId: {
        type: DataTypes.STRING,
      },
      FileName: {
        type: DataTypes.STRING,
      },
      firstname: {
        type: DataTypes.STRING,
      },
      lastname: {
        type: DataTypes.STRING,
      },
      VideoName: {
        type: DataTypes.STRING,
      },
      EventId: {
        type: DataTypes.STRING,
      },
      project_name: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: 'ShowAttachmentLoaded',
      freezeTableName: true,
      timestamps: false,
    }
  );
};

export default ShowAttachmentLoaded;
