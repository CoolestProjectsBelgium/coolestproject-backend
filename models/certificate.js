'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Certificate extends Model {
    static associate(models) {
      Certificate.belongsTo(models.Project, {});
    }
  }
  Certificate.init({
    text: {
      type: DataTypes.STRING,
    },
  }, {
    sequelize,
    modelName: 'Certificate',
  });
  return Certificate;
};