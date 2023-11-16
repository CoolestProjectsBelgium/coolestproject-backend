import { Model, DataTypes, Op, Sequelize } from 'sequelize';

//import { Project } from './project.js';
//import { User } from './user.js';
//import { Event } from './event.js';

interface VoucherAttributes {
  idx: number;
  id: string;
  projectId: string;
  participantId: string;
}

export class Voucher extends Model<VoucherAttributes> {
  public idx!: number;
  public id!: string;
  public projectId!: string;
  public participantId!: string;
}

export const init = (sequelize: Sequelize) => {
  Voucher.init(
    {
      idx: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      id: { type: DataTypes.UUID },
      projectId: { type: DataTypes.STRING },
      participantId: { type: DataTypes.STRING },
    },
    {
      sequelize,
      modelName: 'Voucher',
      indexes: [
        {
          unique: true,
          fields: ['id'],
        },
      ],
      scopes: {
        event(eventId: number) {
          return {
            where: {
              EventId: {
                [Op.eq]: eventId,
              },
            },
          };
        },
      },
    }
  );
}

//Voucher.belongsTo(Project);
//Voucher.belongsTo(User);
//Voucher.belongsTo(Event);