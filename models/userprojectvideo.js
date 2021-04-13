'use strict';
module.exports = (sequelize, DataTypes) => {
  const Videoload = sequelize.define('userprojectvideo', {
    project_name: {
      type: DataTypes.STRING,
    },
    project_descr: {
      type: DataTypes.STRING,
    },
    ProjectID: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    participants: {
        type: DataTypes.STRING
    },
    youtube: {
      type: DataTypes.VIRTUAL,
      get(){
       return process.env.GOOGLE_LINK + "&t=" + this.getDataValue('OFFSET');
      }
    },
  }, {
    freezeTableName: true,
    timestamps: false
  });
  return Videoload;
};