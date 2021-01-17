const DBA = require('../../dba');
const randomstring = require("randomstring");

exports.command = `register`
exports.desc = `Register account with default parameters`

exports.builder = (yargs) => {
    yargs.option('postalcode', { default: '1000', type: "number" })
        .option('email', { default: randomstring.generate(10) + "@test.be" })
        .option('firstname', { default: 'Jane' })
        .option('lastname', { default: 'Doe' })
        .option('sex', { default: 'f', choices: ['m', 'f', 'x'] })
        .option('general_questions', { default: ["photo"] })
        .option('mandatory_approvals', { default: ["ok"] })
        .option('birthmonth', { default: "2010-11-24" })
        .option('sizeId', { default: 1 })
        .option('language', { default: "nl", choices: ['nl', 'fr', 'en'] })
        .option('via', { default: "string" })
        .option('medical', { default: "string" })
        .option('extra', { default: "string" })
        .option('project_name', { default: "string" })
        .option('project_descr', { default: "string" })
        .option('project_lang', { default: "nl", choices: ['nl', 'fr', 'en'] })
        .option('gsm', { default: "+32460789101" })
        .option('gsm_guardian', { default: "+32460789101" })
        .option('email_guardian', { default: randomstring.generate(10) + "@test.be" })
        .option('project_code')
};
exports.handler = async function (argv) {
    try {
        let registrationValues = null
        if (!argv.project_code) {
            registrationValues = {
                "postalcode": argv.postalcode,
                "email": argv.email,
                "firstname": argv.firstname,
                "lastname": argv.lastname,
                "sex": argv.sex,
                "language": argv.language,
                "general_questions": argv.general_questions,
                "mandatory_approvals": argv.mandatory_approvals,
                "birthmonth": argv.birthmonth,
                "sizeId": argv.sizeId,
                "via": argv.via,
                "medical": argv.medical,
                "extra": argv.extra,
                "gsm": argv.gsm,
                "gsm_guardian": argv.gsm_guardian,
                "email_guardian": argv.email_guardian,
                // own project
                "project_name": argv.project_name,
                "project_descr": argv.project_descr,
                "project_type": argv.project_type,
                "project_lang": argv.project_lang,
            }
        } else {
            registrationValues = {
                "postalcode": argv.postalcode,
                "email": argv.email,
                "firstname": argv.firstname,
                "lastname": argv.lastname,
                "sex": argv.sex,
                "language": argv.language,
                "general_questions": argv.general_questions,
                "mandatory_approvals": argv.mandatory_approvals,
                "birthmonth": argv.birthmonth,
                "sizeId": argv.sizeId,
                "via": argv.via,
                "medical": argv.medical,
                "extra": argv.extra,
                "gsm": argv.gsm,
                "gsm_guardian": argv.gsm_guardian,
                "email_guardian": argv.email_guardian,
                "project_code": argv.project_code
            }
        }

        var registration = await DBA.createRegistration(registrationValues);
        console.log('Registration ' + registration.id + ' created');

    } catch (error) {
        console.error(error.message);
        for (var err of error.errors || []) {
            console.error(err.message);
        }
    }
}