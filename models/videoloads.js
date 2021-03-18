'use strict';
module.exports = (sequelize, DataTypes) => {
  const UserProjectVideo = sequelize.define('videoloads', {

    ProjectId: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    ownerId: {
      type: DataTypes.STRING
  },
    FileName: {
      type: DataTypes.STRING
  },
    firstname: {
        type: DataTypes.STRING
    },
    lastname: {
        type: DataTypes.STRING
    },
    VideoName: {
      type: DataTypes.STRING
    },
    project_name: {
      type: DataTypes.STRING,
    },



  }, {
    freezeTableName: true,
    timestamps: false
  });
  return UserProjectVideo;
};