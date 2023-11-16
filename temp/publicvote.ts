import { Model, DataTypes, Sequelize, Optional, Op } from 'sequelize';

interface PublicVoteAttributes {
  phone: string;
}

export class PublicVote extends Model<PublicVoteAttributes> {
  public phone!: string;

  static associate(models: any) {
    PublicVote.belongsTo(models.Project);
    PublicVote.belongsTo(models.Event);
  }
}

export const initPublicVote = (sequelize: Sequelize) => {
  PublicVote.init(
    {
      phone: {
        type: DataTypes.CHAR(100),
        allowNull: false
      },
    },
    {
      sequelize,
      modelName: 'PublicVote',
      indexes: [{ unique: true, fields: ['projectId', 'phone'] }],
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
