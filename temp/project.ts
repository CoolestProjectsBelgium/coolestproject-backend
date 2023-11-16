import { Model, DataTypes, Sequelize, Optional, Op } from 'sequelize';
import { sequelize } from './index.js'

import { User } from './user.js';
import { Voucher } from './voucher.js';
import { Event } from './event.js';
import { Table } from './table.js';
import { ProjectTable } from './project_table.js';
import { Attachment } from './attachment.js';

interface ProjectAttributes {
  project_name: string;
  project_descr: string;
  project_type: string | null;
  internalinfo: string | null;
  project_lang: 'nl' | 'fr' | 'en';
  max_tokens: number | null;
}


export class Project extends Model<ProjectAttributes> {
  public id!: number;
  public project_name!: string;
  public project_descr!: string;
  public project_type!: string | null;
  public internalinfo!: string | null;
  public project_lang!: 'nl' | 'fr' | 'en';
  public max_tokens!: number | null;
}

export const init = (sequelize: Sequelize) => {
  Project.init(
    {
      project_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      project_descr: {
        type: DataTypes.STRING(4000),
        allowNull: false,
      },
      project_type: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      internalinfo: {
        type: DataTypes.STRING(2000),
        allowNull: true,
      },
      project_lang: {
        type: DataTypes.ENUM('nl', 'fr', 'en'),
        validate: {
          isIn: [['nl', 'fr', 'en']],
        },
      },
      max_tokens: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'Project',
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
}

/*
Project.belongsTo(User, { as: 'owner', foreignKey: 'OwnerId' });
Project.belongsToMany(User, {
  as: 'participant',
  through: {
    model: Voucher,
    unique: false,
  },
  foreignKey: 'projectId',
  otherKey: 'participantId',
  constraints: false,
});
Project.hasMany(Voucher, { foreignKey: 'projectId' });
Project.belongsTo(Event);
Project.belongsToMany(Table, { through: ProjectTable });
Project.hasMany(Attachment);*/