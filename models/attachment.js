'use strict';
const {
  Model
} = require('sequelize');

const bcrypt = require("bcrypt");

module.exports = (sequelize, DataTypes) => {
  class Attachment extends Model {

    static associate(models) {
      Attachment.belongsTo(models.Event, { as: 'event', optional: false });
      Attachment.belongsTo(models.Project, {});
    }
  };
  Attachment.init({
    name: DataTypes.STRING(50),
    confirmed: DataTypes.BOOLEAN,
    internal: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Attachment',
  });
  return Attachment;
};