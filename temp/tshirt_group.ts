import { Model, DataTypes, Sequelize } from 'sequelize';

interface TShirtGroupAttributes {
  name: string;
}

export class TShirtGroup extends Model<TShirtGroupAttributes> {
  public name!: string;

  static associate(models: any) {
    TShirtGroup.hasMany(models.TShirtGroupTranslation);
    TShirtGroup.belongsTo(models.Event);
  }

}

export const initTShirtGroup = (sequelize: Sequelize) => {
  TShirtGroup.init(
    {
      name: {
        type: DataTypes.STRING(15), // Use STRING data type for name
      }
    },
    {
      sequelize,
      modelName: 'TShirtGroup',
      indexes: [{ unique: true, fields: ['name', 'eventId'] }],
    }
  );
  
};

export default TShirtGroup;