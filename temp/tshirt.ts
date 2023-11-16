import { Model, DataTypes, Sequelize } from 'sequelize';

interface TShirtAttributes {
  name: string;
}

export default class TShirt extends Model<TShirtAttributes> {
  public name!: string;
  static associate(models: any) {
    TShirt.belongsTo(models.Event);
  }
}

export const initTShirt = (sequelize: Sequelize) => {
  TShirt.init(
    {
      name: {
        type: DataTypes.CHAR(15),
      },
    },
    {
      sequelize,
      modelName: 'TShirt',
      indexes: [{ unique: true, fields: ['name', 'eventId'] }],
    }
  );
};
