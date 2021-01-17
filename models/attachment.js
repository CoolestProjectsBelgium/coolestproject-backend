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
    type: DataTypes.ENUM('movie', 'link')
  }, {
    sequelize,
    modelName: 'Attachment',
  });
  return Attachment;
};