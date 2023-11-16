import { Model, DataTypes, Sequelize } from 'sequelize';

interface TShirtTranslationAttributes {
  language: 'nl' | 'fr' | 'en';
  description: string;
}

export class TShirtTranslation extends Model<TShirtTranslationAttributes> {
  public language!: 'nl' | 'fr' | 'en';
  public description!: string;

  static associate(models: any) {
    TShirtTranslation.belongsTo(models.Event);
  }

}

export const initTShirtTranslation = (sequelize: Sequelize) => {
  TShirtTranslation.init(
    {
      language: {
        type: DataTypes.ENUM('nl', 'fr', 'en'),
      },
      description: {
        type: DataTypes.CHAR(250),
      }    
    },
    {
      sequelize,
      modelName: 'TShirtTranslation',
      indexes: [{ unique: true, fields: ['tShirtId', 'language'] }],
    }
  );
};
