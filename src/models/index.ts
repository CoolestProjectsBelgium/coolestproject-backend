import { Op, Dialect } from 'sequelize';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { Sequelize } from 'sequelize-typescript';
import { Event } from './event.js';
import * as fs from 'fs/promises';

const env = process.env.NODE_ENV || 'development';
const config = {
  database: 'coolestproject_test',
  username: 'coolestproject_test',
  password: '9b6xgLku9vCP8wy2'
};
const configOptions = {
  dialect: 'mysql' as Dialect,
  port: 5306,
};
const sequelize = new Sequelize(config.database, config.username, config.password, configOptions);

sequelize.addModels([Event]);

const models: { [key: string]: any } = {};

//get the current event for the default scope
const currentEvent = await Event.findOne({ where: { eventBeginDate: { [Op.lt]: new Date() }, eventEndDate: { [Op.gt]: new Date() } } });
if(currentEvent){
  Event.addScope('defaultScope', { where: { id: currentEvent.id } });
}
models["Event"] = Event;

const filename = fileURLToPath(import.meta.url);
const dir = dirname(filename);
const files = await fs.readdir(dir);

// loop over directory
for (const file of files) {
  if(file === 'event.js' || file === 'index.js'){
    continue;
  }
  let module = await import( './' + file);
  let name = Object.keys(module)[0];
  let Model = module[name];

  if(currentEvent){
    Model.addScope('defaultScope', { where: { id: currentEvent.id } });
  }
  models[name] = Model;
}
sequelize.addModels(Object.values(models));

export { models };
