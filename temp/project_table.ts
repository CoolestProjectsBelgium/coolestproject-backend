import { Model, DataTypes, Sequelize, Optional, Op } from 'sequelize';
//import { sequelize } from './index.js'

//import { Project } from './project.js';
//import { Table } from './table.js';
//import { Event } from './event.js';

interface ProjectTableAttributes {
  usedPlaces: number;
  startTime: Date;
  endTime: Date;
}

export class ProjectTable extends Model<ProjectTableAttributes> {
  public id!: number;
  public usedPlaces!: number;
  public startTime!: Date;
  public endTime!: Date;
  public EventId!: number;
  public TableId!: number;
  public ProjectId!: number;
}

export const init = (sequelize: Sequelize) => {
  ProjectTable.init(
    {
      usedPlaces: DataTypes.INTEGER,
      startTime: DataTypes.DATE,
      endTime: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: 'ProjectTable',
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

//ProjectTable.belongsTo(Project);
//ProjectTable.belongsTo(Table);
//ProjectTable.belongsTo(Event);