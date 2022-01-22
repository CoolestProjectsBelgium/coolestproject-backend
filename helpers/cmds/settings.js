const DBA = require('../../dba');
const database = new DBA();

const addYears = require('date-fns/addYears');

const endOfMonth = require('date-fns/endOfMonth');
const startOfMonth = require('date-fns/startOfMonth');

exports.command = 'setting';
exports.desc = 'Get the current settings for the site';
exports.builder = (yargs) => {
};
exports.handler = async function (argv) {
  const event = await database.getEventActive();
  console.log('== Event based settings ==');
  console.log(`date of the event ${new Date(event.officialStartDate).toLocaleDateString(process.env.LANG)}`);
  console.log(`The max age is ${event.maxAge}`);
  console.log(`The min age is ${event.minAge}`);
  console.log(`The min age without guardian is ${event.minGuardianAge}`);
  console.log(`Max vouchers per project ${event.maxVoucher}`);

  const minGuardian = addYears(startOfMonth(event.officialStartDate), -1 * event.minGuardianAge).toLocaleDateString(process.env.LANG);
  const isBefore = addYears(endOfMonth(event.officialStartDate), -1 * event.minAge).toISOString().substr(0, 10);
  const isAfter = addYears(startOfMonth(event.officialStartDate), -1 * event.maxAge).toISOString().substr(0, 10);

  console.log(`The min birthdate is ${isAfter}`);
  console.log(`The max birthdate is ${isBefore}`);
  console.log(`No guardian required before ${minGuardian}`);
};