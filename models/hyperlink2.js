'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Hyperxlink extends Model {
    static associate(models) {
    Hyperxlink.belongsTo(models.Project, {});
    //Hyperxlink.hasOne(models.Project, {});
    }
  }
  Hyperxlink.init({
    URL: {
      type: DataTypes.STRING,
    },
  }, {
    sequelize,
    modelName: 'Hyperxlink',
  });
  return Hyperxlink;
};