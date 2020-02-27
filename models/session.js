'use strict';
module.exports = (sequelize, DataTypes) => {
  const Session = sequelize.define('Session', {
    sid: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    expires: {
      type: DataTypes.DATE
    },
    data: {
      type: DataTypes.STRING
    }
  }, {
    freezeTableName: true
  });
  return Session;
};
