'use strict';
module.exports = (sequelize, DataTypes) => {
  const projectstats= sequelize.define('stats_teams', {
 

    deelnmers_per_project: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    eventid: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    aantal_in_dit_geval: {
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