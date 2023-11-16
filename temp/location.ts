import { Model, DataTypes, Sequelize, Optional, Op } from 'sequelize';

interface LocationAttributes {
  text: string;
}

export class Location extends Model<LocationAttributes> {
  public text!: string;
  public EventId!: number;

  static associate(models: any) {
    Location.belongsTo(models.Event);
    Location.hasMany(models.Table);
  }
}

export const initLocation = (sequelize: Sequelize) => {
  Location.init(
    {
      text: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: 'Location',
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
};
