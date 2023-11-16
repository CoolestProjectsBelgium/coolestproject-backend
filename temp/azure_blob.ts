import { Model, DataTypes, Sequelize, Optional, Op } from 'sequelize';
import { BelongsToCreateAssociationMixin, BelongsToGetAssociationMixin } from 'sequelize';

//import { sequelize, currentEvent } from './index.js'
//import { Attachment } from './attachment.js';
//import { Event } from './event.js';

interface AzureBlobAttributes {
  container_name: string;
  blob_name: string;
  size: number;
  EventId: number;
}

export class AzureBlob extends Model<AzureBlobAttributes> {
  public container_name!: string;
  public blob_name!: string;
  public size!: number;
  public EventId!: number;
}

export const init = (sequelize: Sequelize) => {
  AzureBlob.init(
    {
      container_name: {
        type: DataTypes.STRING(100),
      },
      blob_name: {
        type: DataTypes.STRING(100),
      },
      size: DataTypes.BIGINT,
      EventId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'AzureBlob',
      indexes: [
        {
          unique: true,
          fields: ['container_name', 'blob_name'],
        },
      ],
      scopes: {
        event: (eventId: number) => {
          return {
            where: {
              EventId: eventId,
            },
          };
        },
      },
    }
  );
}

//AzureBlob.belongsTo(Attachment);
//AzureBlob.belongsTo(Event);

//if (currentEvent) {
//  AzureBlob.addScope('defaultScope', {
//    where: {
//      EventId: { [Op.eq]: currentEvent.id }
//    }
//  });
//}