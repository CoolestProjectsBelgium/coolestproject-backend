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
      Event.hasMany(models.Question);
    }
  };
  Event.init({
    azure_storage_container: DataTypes.STRING(20),
    minAge: DataTypes.INTEGER,
    maxAge: DataTypes.INTEGER,
    minGuardianAge: DataTypes.INTEGER,
    maxRegistration: DataTypes.INTEGER,
    maxVoucher: DataTypes.INTEGER,
    pending_user: DataTypes.VIRTUAL,
    overdue_registration: DataTypes.VIRTUAL,
    waiting_list: DataTypes.VIRTUAL,
    days_remaining: DataTypes.VIRTUAL,
    t_proj: DataTypes.VIRTUAL,
    t_users: DataTypes.VIRTUAL,
    total_males: DataTypes.VIRTUAL,
    total_females: DataTypes.VIRTUAL,
    total_X: DataTypes.VIRTUAL,
    total_unusedVouchers: DataTypes.VIRTUAL,
    current: DataTypes.BOOLEAN,
    startDate: DataTypes.DATE,
    event_title: DataTypes.STRING(25)
  }, {
    sequelize,
    modelName: 'Event',
  });
  return Event;
};