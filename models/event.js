'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Event.init({
    startDate: DataTypes.DATE,
    minAge: DataTypes.INTEGER,
    maxAge: DataTypes.INTEGER,
    minGuardianAge: DataTypes.INTEGER,
    maxRegistration: DataTypes.INTEGER,
    maxVoucher: DataTypes.INTEGER,
    current: DataTypes.BOOLEAN,
    pending_users: DataTypes.VIRTUAL,
    overdue_registration: DataTypes.VIRTUAL,
    waiting_list: DataTypes.VIRTUAL,
    days_remaining: DataTypes.VIRTUAL,
    total_users: DataTypes.VIRTUAL,
    total_males: DataTypes.VIRTUAL,
    total_females: DataTypes.VIRTUAL
  }, {
    sequelize,
    modelName: 'Event',
  });
  return Event;
};