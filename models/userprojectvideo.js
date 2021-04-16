'use strict';
module.exports = (sequelize, DataTypes) => {
  const Videoload = sequelize.define('userprojectvideo', {
 
    Description: {
      type: DataTypes.STRING,
    },
    link: {
      type: DataTypes.STRING
    },
    ProjectID: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    participants: {
        type: DataTypes.STRING
    },
    Language: {
      type: DataTypes.STRING,
    },
    Project_name: {
      type: DataTypes.STRING,
    },

  }, {
    freezeTableName: true,
    timestamps: false
  });
  return Videoload;
};