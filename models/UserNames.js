'use strict';
module.exports = (sequelize, DataTypes) => {
  const UserNames = sequelize.define('UserNames', {
    email: {
      type: DataTypes.STRING,
      primaryKey: true
  },
    firstname: {
        type: DataTypes.STRING
    },
    lastname: {
      type: DataTypes.STRING

  }
  }, {
    freezeTableName: true,
    timestamps: false
  });
  return UserNames;
};