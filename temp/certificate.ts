import { Model, DataTypes, Sequelize, Optional } from 'sequelize';

interface CertificateAttributes {
  text: string;
}

export class Certificate extends Model<CertificateAttributes> {
  public text!: string;

  static associate(models: any) {
    Certificate.belongsTo(models.Project);
    Certificate.belongsTo(models.Event);
  }
}

export const initCertificate = (sequelize: Sequelize) => {
  Certificate.init(
    {
      text: {
        type: DataTypes.STRING(4000),
      },
    },
    {
      sequelize,
      modelName: 'Certificate',
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