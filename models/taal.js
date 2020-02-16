'use strict';
module.exports = (sequelize, DataTypes) => {
  const taal = sequelize.define('taal', {
    taal: {
      type: DataTypes.STRING,
      primaryKey: true
  },
    total: {
        type: DataTypes.STRING
    }
  }, {
    freezeTableName: true,
    timestamps: false
  });
  return taal;
};