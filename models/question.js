'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Question extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Question.belongsTo(models.Event, { as: 'event', optional: false });
      Question.belongsToMany(models.User, { through: models.QuestionUser }); // A BelongsToMany B through the junction table C
    }
  };
  Question.init({
    name: { type: DataTypes.CHAR(30), unique: true },
    mandatory: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Question',
  });
  return Question;
};