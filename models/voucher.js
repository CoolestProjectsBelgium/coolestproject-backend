'use strict';
module.exports = (sequelize, DataTypes) => {
  const Voucher = sequelize.define('Voucher', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true
    }
  }, {});
  Voucher.associate = function(models) {
    Voucher.belongsTo(models.Project, { as: 'project' });
    Voucher.belongsTo(models.User, { as: 'participant' })
  };
  return Voucher;
};
  