'use strict';
module.exports = (sequelize, DataTypes) => {
  const UserProjectView = sequelize.define('UserProjectView', {
    p_id: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    project_name: {
        type: DataTypes.STRING
    },
    owner_name: {
        type: DataTypes.STRING
    },
    nmbr_vouchers: {
        type: DataTypes.STRING
    },
    participants: {
        type: DataTypes.STRING
    }
  }, {
    freezeTableName: true,
    timestamps: false
  });
  return UserProjectView;
};