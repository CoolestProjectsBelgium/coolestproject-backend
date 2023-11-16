import { Model, DataTypes, Sequelize, Optional } from 'sequelize';
//import { sequelize } from './index.js'

//import { Project } from './project.js';
//import { Event } from './event.js';
//import { AzureBlob } from './azure_blob.js';
//import { Hyperlink } from './hyperlink.js';

interface AttachmentAttributes {
  confirmed: boolean;
  internal: boolean;
  filename: string;
  name: string;
}

export class Attachment extends Model<AttachmentAttributes> {
  public confirmed!: boolean;
  public internal!: boolean;
  public filename!: string;
  public name!: string;
}

export const init = (sequelize: Sequelize) => {
  Attachment.init({
    confirmed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    internal: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    filename: DataTypes.STRING(255),
    name: DataTypes.STRING(50)
  }, {
    sequelize,
    modelName: 'Attachment',
    scopes: {
      event: (eventId: number) => {
        return {
          where: {
            EventId: eventId,
          },
        };
      },
    },
  });
}

//Attachment.belongsTo(Project);
//Attachment.hasOne(AzureBlob);
//Attachment.hasOne(Hyperlink);
//Attachment.belongsTo(Event);