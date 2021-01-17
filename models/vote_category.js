'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class VoteCategory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      VoteCategory.belongsTo(models.Event, { as: 'event', optional: false });
    }
  };
  VoteCategory.init({
    name: { type: DataTypes.CHAR(15), unique: true },
    min: { type: DataTypes.INTEGER },
    max: { type: DataTypes.INTEGER },
    public: { type: DataTypes.BOOLEAN }
  }, {
    sequelize,
    modelName: 'VoteCategory',
  });
  return VoteCategory;
};