import { Model, DataTypes, Sequelize } from 'sequelize';

interface AwardAttributes {
  // Define the attributes of the Award model here
}

export class Award extends Model<AwardAttributes> {
  // Define the attributes of the Award model here

  //TODO check for manadatory 
  static associate(models: any) {
    Award.belongsTo(models.Event);
    Award.belongsTo(models.Project);
    Award.belongsTo(models.VoteCategory);
    Award.belongsTo(models.Account);
  }
}

export const initAward = (sequelize: Sequelize) => {
  Award.init(
    {
      // Define the attributes of the Award model here
    },
    {
      sequelize,
      modelName: 'Award',
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