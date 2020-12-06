'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Table extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Table.belongsTo(models.Event, { as: 'event', optional: false });
    }
  };
  Table.init({
    name: { type: DataTypes.CHAR(15), unique: true },
    location: DataTypes.CHAR(20),
    maxPlaces: DataTypes.INTEGER,
    requirements: DataTypes.JSON,
  }, {
    sequelize,
    modelName: 'Table',
  });
  return Table;
};