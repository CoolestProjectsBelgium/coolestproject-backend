'use strict';
module.exports = (sequelize, DataTypes) => {
  const t_shirt_sizes = sequelize.define('tshirtsizes', {
    t_shirt_sizes: {
      type: DataTypes.STRING,
      primaryKey: true
  },
    nmbr: {
        type: DataTypes.STRING
    }
  }, {
    freezeTableName: true,
    timestamps: false
  });
  return t_shirt_sizes;
};