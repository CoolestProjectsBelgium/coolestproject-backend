'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class QuestionRegistration extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      QuestionRegistration.belongsTo(models.Question, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });
      QuestionRegistration.belongsTo(models.Registration, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });
    }
  };
  QuestionRegistration.init({
    RegistrationId: DataTypes.INTEGER,
    QuestionId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'QuestionRegistration',
  });
  return QuestionRegistration;
};