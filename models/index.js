'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

// This cannot be done in config.json
// Do we want to make this configurable?
const ssl = {
  dialectOptions: {
    ssl  : {
      ca : fs.readFileSync(__dirname + '/DigiCertGlobalRootCA.crt.pem')
      }  
    }
  };

const configssl = Object.assign(config, ssl); // Merge config.json and the SSL addition
console.log('Sequelize DB Options: %s', configssl); // Test

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], configssl);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, configssl);
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
