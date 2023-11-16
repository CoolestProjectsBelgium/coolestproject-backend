import { Model, DataTypes, Sequelize, Optional, Op } from 'sequelize';

interface QuestionAttributes {
  name: string;
  mandatory: boolean;
}

export class Question extends Model<QuestionAttributes> {
  public name!: string;
  public mandatory!: boolean;

  static associate(models: any) {
    Question.belongsTo(models.Event);
    Question.belongsToMany(models.User, { through: models.QuestionUser, as: 'users' });
    Question.belongsToMany(models.Registration, { through: models.QuestionRegistration, as: 'registration' });
    Question.hasMany(models.QuestionTranslation);
  }
}

export const initQuestion = (sequelize: Sequelize) => {
  Question.init(
    {
      name: {
        type: DataTypes.CHAR(30),
      },
      mandatory: {
        type: DataTypes.BOOLEAN,
      },
    },
    {
      sequelize,
      modelName: 'Question',
      indexes: [{ unique: true, fields: ['eventId', 'name'] }],
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
