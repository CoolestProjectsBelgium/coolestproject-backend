const DBA = require('../../dba');

const addYears = require('date-fns/addYears')
const addDays = require('date-fns/addDays')
const parseISO = require('date-fns/parseISO')

exports.command = `setting`
exports.desc = `Get the current settings for the site`

exports.builder = (yargs) => {
};
exports.handler = async function (argv) {
    const event = DBA.getEventActive()
    console.log(`== Event based settings ==`)
    console.log(`date of the event ${new Date(event.startDate).toLocaleDateString(process.env.LANG)}`)
    console.log(`The max age is ${event.maxAge}`)
    console.log(`The min age is ${event.minAge}`)
    console.log(`The min age without guardian is ${event.minGuardianAge}`)
    console.log(`Max vouchers per project ${event.maxVoucher}`)

    const minGuardian = addYears(parseISO(event.startDate), -1 * event.minGuardianAge).toLocaleDateString(process.env.LANG)
    const isAfter = addDays(addYears(parseISO(event.startDate), -1 * event.maxAge), -1).toISOString().substr(0, 10)
    const isBefore = addDays(addYears(parseISO(event.startDate), -1 * event.minAge), 1).toISOString().substr(0, 10)

    console.log(`The min birthdate is ${isAfter}`)
    console.log(`The max birthdate is ${isBefore}`)
    console.log(`No guardian required after ${minGuardian}`)
}