'use strict';
module.exports = (sequelize, DataTypes) => {
  const Project = sequelize.define('Project', {
    project_name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    project_descr: {
      type: DataTypes.STRING(4000),
      allowNull: false
    },
    project_type: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    project_lang: {
      type: DataTypes.ENUM('nl', 'fr', 'en'),
      validate: {
        isIn: [['nl', 'fr', 'en']]
      }
    },
    max_tokens: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {});
  Project.associate = function (models) {
    Project.belongsTo(models.User, { as: 'owner' });
    Project.belongsToMany(models.User, {
      as: 'participant',
      through: {
        model: models.Voucher,
        unique: false
      },
      foreignKey: 'participantId',
      otherKey: 'projectId',
      constraints: false
    })
    Project.hasMany(models.Voucher, { foreignKey: 'projectId' })
  };
  return Project;
};
