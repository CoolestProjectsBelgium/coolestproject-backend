'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Sessions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
    }
  }
  Sessions.init({
    sid: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    expires: {
      type: DataTypes.DATE
    },
    data: {
      type: DataTypes.STRING
    }
  }, {
    sequelize,
    modelName: 'Sessions', // we need plural in this case (Sessions is handled by AdminBro)
    freezeTableName: true
  });
  return Sessions;
};