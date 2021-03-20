'use strict';
module.exports = (sequelize, DataTypes) => {
  const t_shirt_sizes = sequelize.define('CountTshirtSizes', {
    id:{
      type: DataTypes.STRING},
    name: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    count: {
      type: DataTypes.STRING
    }
  }, {
    freezeTableName: true,
    timestamps: false
  });
  return t_shirt_sizes;
};