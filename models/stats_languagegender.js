'use strict';
module.exports = (sequelize, DataTypes) => {
  const projectstats= sequelize.define('stats_languagegender', {
 

    language: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    sex: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    eventid: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    count: {
      type: DataTypes.INTEGER
    },
  }, {
    freezeTableName: true,
    timestamps: false
  });
  // disable creation
  projectstats.sync = () => {};
  return projectstats;
};