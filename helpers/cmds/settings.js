const dba = require('../../dba');

const addYears = require('date-fns/addYears')
const addDays = require('date-fns/addDays')
const parseISO = require('date-fns/parseISO')

exports.command = `setting`
exports.desc = `Get the current settings for the site`

exports.builder = (yargs) => {
};
exports.handler = async function (argv) {
    console.log(`== Event based settings ==`)
    console.log(`date of the event ${new Date(process.env.START_DATE).toLocaleDateString(process.env.LANG)}`)
    console.log(`The max age is ${process.env.MAX_AGE}`)
    console.log(`The min age is ${process.env.MIN_AGE}`)
    console.log(`The min age without guardian is ${process.env.GUARDIAN_AGE}`)
    console.log(`Max vouchers per project ${process.env.MAX_VOUCHERS}`)

    const minGuardian = addYears(parseISO(process.env.START_DATE), -1 * process.env.GUARDIAN_AGE).toLocaleDateString(process.env.LANG)
    const isAfter = addDays(addYears(parseISO(process.env.START_DATE), -1 * process.env.MAX_AGE), -1).toISOString().substr(0, 10)
    const isBefore = addDays(addYears(parseISO(process.env.START_DATE), -1 * process.env.MIN_AGE), 1).toISOString().substr(0, 10)

    console.log(`The min birthdate is ${isAfter}`)
    console.log(`The max birthdate is ${isBefore}`)
    console.log(`No guardian required after ${minGuardian}`)
}