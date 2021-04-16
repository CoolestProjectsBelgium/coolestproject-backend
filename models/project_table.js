'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ProjectTable extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ProjectTable.belongsTo(models.Project);
      ProjectTable.belongsTo(models.Table);
    }
  }
  ProjectTable.init({
    usedPlaces: DataTypes.INTEGER,
    ProjectId: DataTypes.INTEGER,
    TableId: DataTypes.INTEGER,
    startTime: DataTypes.DATE,
    endTime: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'ProjectTable',
  });
  return ProjectTable;
};