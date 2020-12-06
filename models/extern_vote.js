'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ExternVote extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ExternVote.belongsTo(models.Event, { as: 'event', optional: false });
      ExternVote.belongsTo(models.VoteCategory, { as: 'category', optional: false });
      ExternVote.belongsTo(models.Project, { as: 'project', optional: false });
    }
  };
  ExternVote.init({
    amount: { type: DataTypes.INTEGER },
    reference: { type: DataTypes.STRING }
  }, {
    sequelize,
    modelName: 'ExternVote',
  });
  return ExternVote;
};