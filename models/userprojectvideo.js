'use strict';
module.exports = (sequelize, DataTypes) => {
  const UserProjectVideo = sequelize.define('UserProjectVideo', {
    offset: {
      type: DataTypes.STRING,
    },
    project_name: {
      type: DataTypes.STRING,
    },
    projectid: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    owner_name: {
        type: DataTypes.STRING
    },
    participants: {
        type: DataTypes.STRING
    },
    youtube: {
      type: DataTypes.STRING
  },
  }, {
    freezeTableName: true,
    timestamps: false
  });
  return UserProjectVideo;
};