'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Hyperlink extends Model {
    static associate(models) {
      Hyperlink.belongsTo(models.Attachment, {});
    }
  }
  Hyperlink.init({
    href: {
      type: DataTypes.STRING(250),
      unique: true
    }
  }, {
    sequelize,
    modelName: 'Hyperlink',
  });
  return Hyperlink;
};