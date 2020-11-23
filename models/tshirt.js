'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TShirt extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  TShirt.init({
    name: { type: DataTypes.CHAR(15), unique: true },
  }, {
    sequelize,
    modelName: 'TShirt',
  });
  return TShirt;
};