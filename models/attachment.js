'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Attachment extends Model {

    static associate(models) {
      Attachment.belongsTo(models.Project, {});
      Attachment.hasOne(models.AzureBlob, {});
    }
  }
  Attachment.init({
    name: DataTypes.STRING(50),
    confirmed: DataTypes.BOOLEAN,
    internal: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Attachment',
    onDelete: 'CASCADE'
  });
  return Attachment;
};