'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class QuestionUser extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      QuestionUser.belongsTo(models.Question, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });
      QuestionUser.belongsTo(models.User, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });
      QuestionUser.belongsTo(models.Event, { foreignKey: { allowNull: true }});
    }
  }
  QuestionUser.init({
    // TODO: These fields are blocking the associations (see above). To be tested.
    UserId: DataTypes.INTEGER,
    QuestionId: DataTypes.INTEGER,
    EventId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'QuestionUser',
  });
  return QuestionUser;
};