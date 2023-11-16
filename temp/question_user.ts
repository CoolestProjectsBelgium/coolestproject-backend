import { Model, Sequelize, Optional, Op } from 'sequelize';

interface QuestionUserAttributes {}

export class QuestionUser extends Model<QuestionUserAttributes> {
  static associate(models: any) {
    QuestionUser.belongsTo(models.Question);
    QuestionUser.belongsTo(models.User);
    QuestionUser.belongsTo(models.Event);
  }
}

export const initQuestionUser = (sequelize: Sequelize) => {
  QuestionUser.init(
    {},
    {
      sequelize,
      modelName: 'QuestionUser',
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
