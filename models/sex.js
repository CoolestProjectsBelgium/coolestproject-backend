'use strict';
module.exports = (sequelize, DataTypes) => {
  const m_f = sequelize.define('sex', {
    m_f: {
      type: DataTypes.STRING,
      primaryKey: true
  },
    total: {
        type: DataTypes.STRING
    }
  }, {
    freezeTableName: true,
    timestamps: false
  });
  return m_f;
};