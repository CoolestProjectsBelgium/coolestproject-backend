import { Model, DataTypes, Sequelize, Optional, Op } from 'sequelize';

interface QuestionRegistrationAttributes {}

export class QuestionRegistration extends Model<QuestionRegistrationAttributes> {
  static associate(models: any) {
    QuestionRegistration.belongsTo(models.Question, {
      foreignKey: { allowNull: false },
      onDelete: 'RESTRICT',
    });
    QuestionRegistration.belongsTo(models.Registration, {
      foreignKey: { allowNull: false },
      onDelete: 'CASCADE',
    });
    QuestionRegistration.belongsTo(models.Event);
  }
}

export const initQuestionRegistration = (sequelize: Sequelize) => {
  QuestionRegistration.init(
    {},
    {
      sequelize,
      modelName: 'QuestionRegistration',
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
