const models = require('../../models');
const { Umzug } = require('umzug');

const sequelize = models.sequelize;

exports.command = 'init_db';
exports.desc = 'Sync model with DB without migrations';

exports.builder = (yargs) => { };

exports.handler = async function (argv) {
  await sequelize.sync({ force: true });
  console.log('All models were synchronized successfully.');
};

