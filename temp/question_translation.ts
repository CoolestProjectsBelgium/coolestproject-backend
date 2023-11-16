import { Model, DataTypes, Sequelize, Optional, Op } from 'sequelize';

interface QuestionTranslationAttributes {
  language: 'nl' | 'fr' | 'en';
  description: string | null;
  positive: string | null;
  negative: string | null;
}


export class QuestionTranslation extends Model<QuestionTranslationAttributes> {
  public language!: 'nl' | 'fr' | 'en';
  public description!: string | null;
  public positive!: string | null;
  public negative!: string | null;
}

export const initQuestionTranslation = (sequelize: Sequelize) => {
  QuestionTranslation.init(
    {
      language: DataTypes.ENUM('nl', 'fr', 'en'),
      description: {
        type: DataTypes.CHAR(255),
      },
      positive: {
        type: DataTypes.CHAR(120),
      },
      negative: {
        type: DataTypes.CHAR(120),
      },
    },
    {
      sequelize,
      modelName: 'QuestionTranslation',
      indexes: [{ unique: true, fields: ['questionId', 'language'] }],
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
