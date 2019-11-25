'use strict';
module.exports = (sequelize, DataTypes) => {
  const Project = sequelize.define('Project', {
    project_name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    project_descr: {
      type: DataTypes.STRING(500),
      allowNull: false
    },
    project_type: {
      type: DataTypes.JSON,
      get () {
        return JSON.parse(this.getDataValue('project_type'));
      },
      set (value) {
        this.setDataValue('project_type', JSON.stringify(value));
      },
      validate: {
        isJSON(value) {
          try{
            JSON.parse(value);
          } catch (error) {
            throw new Error('JSON is not valid');
          }
        }
      },
      allowNull: false
    },
    project_lang: {
      type: DataTypes.ENUM('nl','fr','en'),
      validate: {
        isIn: [['nl','fr','en']]
      }
    }
  }, {});
  Project.associate = function(models) {
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
  };
  return Project;
};
