import { Model, DataTypes, Sequelize, Optional, Op } from 'sequelize';

interface VoteCategoryAttributes {
  name: string;
  min: number;
  max: number;
  public: boolean | null;
  optional: boolean | null;
}

class VoteCategory extends Model<VoteCategoryAttributes> {
  public name!: string;
  public min!: number;
  public max!: number;
  public public!: boolean | null;
  public optional!: boolean | null;

  static associate(models: any) {
    VoteCategory.belongsTo(models.Event);
  }
}

export default (sequelize: Sequelize) => {
  VoteCategory.init(
    {
      name: { type: DataTypes.CHAR(50), allowNull: false },
      min: { type: DataTypes.INTEGER, allowNull: false },
      max: { type: DataTypes.INTEGER, allowNull: false },
      public: { type: DataTypes.BOOLEAN },
      optional: { type: DataTypes.BOOLEAN },
    },
    {
      sequelize,
      modelName: 'VoteCategory',
      indexes: [{ unique: true, fields: ['eventId', 'name'] }],
      scopes: {
        event(eventId: number) {
          return {
            where: {
              eventId: {
                [Op.eq]: eventId,
              },
            },
          };
        },
      },
    }
  );

  return VoteCategory;
};