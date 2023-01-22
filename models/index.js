'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const sslenabled = Boolean((process.env.SSL_ENABLED) == '1');
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

// This cannot be done in config.json
console.log('Sequelize SSL Enabled: %s', sslenabled);
let configOptions;
if (sslenabled) {
  const ssl = {
    dialectOptions: {
      ssl  : {
        ca : fs.readFileSync(__dirname + '/../DigiCertGlobalRootCA.crt.pem')
        }  
      }
    };
  configOptions = Object.assign(config, ssl); // Merge config.json and the SSL addition
}
else
{
  configOptions = config;
}

console.log('Sequelize DB ConfigOptions: %O', configOptions); // Test

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], configOptions);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, configOptions);
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
