import { Table, Column, Model, HasMany, DataType } from 'sequelize-typescript';

@Table
export class Event extends Model {
  @Column(DataType.STRING)
  azure_storage_container: string = "";

  @Column(DataType.NUMBER)
  minAge: number = 0;

  @Column(DataType.NUMBER)
  maxAge: number = 0;

  @Column(DataType.NUMBER)
  minGuardianAge: number = 0;

  @Column(DataType.NUMBER)
  maxRegistration: number = 0;

  @Column(DataType.NUMBER)
  maxVoucher: number = 0;

  @Column(DataType.DATE)
  eventBeginDate: Date = new Date();

  @Column(DataType.DATE)
  registrationOpenDate: Date = new Date();

  @Column(DataType.DATE)
  registrationClosedDate: Date = new Date();

  @Column(DataType.DATE)
  projectClosedDate: Date = new Date();

  @Column(DataType.DATE)
  officialStartDate: Date = new Date();

  @Column(DataType.DATE)
  eventEndDate: Date = new Date();

  @Column(DataType.STRING)
  event_title: string = "";

  @Column(DataType.NUMBER)
  maxFileSize: number = 0;
}