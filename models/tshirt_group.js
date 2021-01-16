'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TShirtGroup extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      TShirtGroup.belongsTo(models.Event, { as: 'event', optional: false });
      TShirtGroup.hasMany(models.TShirtGroupTranslation)
    }
  };
  TShirtGroup.init({
    name: { type: DataTypes.CHAR(15), unique: true }
  }, {
    sequelize,
    modelName: 'TShirtGroup',
  });
  return TShirtGroup;
};