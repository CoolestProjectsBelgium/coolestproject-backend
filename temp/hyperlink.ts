import { Model, DataTypes, Sequelize, Optional, Op } from 'sequelize';

//import { sequelize } from './index.js'

interface HyperlinkAttributes {
  EventId: number;
  href: string;
}

export class Hyperlink extends Model<HyperlinkAttributes> {
  public EventId!: number;
  public href!: string;

  static associate(models: any) {
    Hyperlink.belongsTo(models.Attachment);
    Hyperlink.belongsTo(models.Event);
  }
}

export const init = (sequelize: Sequelize) => {
  Hyperlink.init(
    {
      EventId: DataTypes.INTEGER,
      href: {
        type: DataTypes.STRING(250),
        unique: true,
      },
    },
    {
      sequelize,
      modelName: 'Hyperlink',
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