import { Model, DataTypes, Sequelize } from 'sequelize';

interface TShirtGroupTranslationAttributes {
  language: 'nl' | 'fr' | 'en';
  description: string;
}

class TShirtGroupTranslation extends Model<TShirtGroupTranslationAttributes> {
  public language!: 'nl' | 'fr' | 'en';
  public description!: string;
  static associate(models: any) {
    TShirtGroupTranslation.belongsTo(models.Event);
  }
}

export const initTShirtGroupTranslation = (sequelize: Sequelize) => {
  TShirtGroupTranslation.init(
    {
      language: DataTypes.ENUM('nl', 'fr', 'en'),
      description: {
        type: DataTypes.STRING(250), // Use STRING data type for description
      }
    },
    {
      sequelize,
      modelName: 'TShirtGroupTranslation',
      indexes: [{ unique: true, fields: ['tShirtGroupId', 'language'] }],
    }
  );
};

export default TShirtGroupTranslation;
