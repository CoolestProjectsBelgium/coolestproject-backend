'use strict';
module.exports = (sequelize, DataTypes) => {
  const UserProjectViewAll = sequelize.define('UserProjectViewAll', {
    P_id: {
      type: DataTypes.STRING,
      primaryKey: true
  },
    project_name: {
        type: DataTypes.STRING,
    },
    owner_name: {
        type: DataTypes.STRING
    },
    nmbr_voucher: {
        type: DataTypes.STRING
    },
    participants: {
        type: DataTypes.STRING
    },
    created_at: {
      type: DataTypes.STRING
  }
  }, {
    freezeTableName: true,
    timestamps: false
  });
  return UserProjectViewAll;
};