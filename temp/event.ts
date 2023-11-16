import { Model, DataTypes, Sequelize, Optional, Op } from 'sequelize';

interface EventAttributes {
  azure_storage_container: string;
  minAge: number;
  maxAge: number;
  minGuardianAge: number;
  maxRegistration: number;
  maxVoucher: number;
  eventBeginDate: Date;
  registrationOpenDate: Date;
  registrationClosedDate: Date;
  projectClosedDate: Date;
  officialStartDate: Date;
  eventEndDate: Date;
  event_title: string;
  maxFileSize: number;
}

export class Event extends Model<EventAttributes> {
  public azure_storage_container!: string;
  public minAge!: number;
  public maxAge!: number;
  public minGuardianAge!: number;
  public maxRegistration!: number;
  public maxVoucher!: number;
  public eventBeginDate!: Date;
  public registrationOpenDate!: Date;
  public registrationClosedDate!: Date;
  public projectClosedDate!: Date;
  public officialStartDate!: Date;
  public eventEndDate!: Date;
  public event_title!: string;
  public maxFileSize!: number;
  id: any;

  get current(): boolean {
    return this.get('eventBeginDate') < new Date() && this.get('eventEndDate') > new Date();
  }

  get closed(): boolean {
    return new Date() < this.get('eventBeginDate') || new Date() > this.get('eventEndDate');
  }

  get registrationClosed(): boolean {
    return new Date() > this.get('registrationClosedDate');
  }

  get registrationOpen(): boolean {
    return this.get('registrationOpenDate') < new Date() && this.get('registrationClosedDate') > new Date();
  }

  get projectClosed(): boolean {
    return new Date() > this.get('projectClosedDate');
  }
}

export const init = (sequelize: Sequelize) => {
  Event.init(
    {
      azure_storage_container: DataTypes.STRING(200),
      minAge: DataTypes.INTEGER,
      maxAge: DataTypes.INTEGER,
      minGuardianAge: DataTypes.INTEGER,
      maxRegistration: DataTypes.INTEGER,
      maxVoucher: DataTypes.INTEGER,
      eventBeginDate: DataTypes.DATE,
      registrationOpenDate: DataTypes.DATE,
      registrationClosedDate: DataTypes.DATE,
      projectClosedDate: DataTypes.DATE,
      officialStartDate: DataTypes.DATE,
      eventEndDate: DataTypes.DATE,
      event_title: DataTypes.STRING(25),
      maxFileSize: DataTypes.BIGINT,
    },
    {
      sequelize,
      modelName: 'Event',
    }
  );
};

/*
static associate() {
  Event.hasMany(models.Question);
  Event.hasMany(models.Location);  
}
*/