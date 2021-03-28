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
    filename: DataTypes.STRING(255),
    confirmed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    internal: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    sequelize,
    modelName: 'Attachment',
    onDelete: 'CASCADE'
  });
  return Attachment;
};