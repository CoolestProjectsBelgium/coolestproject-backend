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
        //todo: try to understand why it is undefined in some cases
        var project_type = this.getDataValue('project_type')
        if(project_type === undefined){
          return project_type;
        }
        return JSON.parse(project_type);
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
        unique: false,
        /*
        scope: {
          taggable: 'post'
        }*/
      },
      foreignKey: 'participantId',
      otherKey: 'projectId',
      constraints: false
    })
  };
  return Project;
};
