const Mail = require('nodemailer/lib/mailer');
const DBA = require('../../dba');
const Mailer = require('../../mailer');
const Tokens = require('../../jwts');

exports.command = `mail`
exports.desc = `Mail related scripts`

exports.builder = (yargs) => {
    yargs.command('test', 'Send a mail with template',
        () => { },
        async (argv) => {
            const mail = await Mailer.testMail()
            console.log(`Mail was send ${mail}`);
        }
    )
    yargs.command('activationMail <registrationId>', 'Send activation mail',
        () => { },
        async (argv) => {
            try {
                const registration = await DBA.getRegistration(argv.registrationId);
                const event = await DBA.getEventActive();
                const token = await Tokens.generateRegistrationToken(argv.registrationId);
                const mail = await Mailer.activationMail(registration, token, event);
                console.log(`Mail was send ${mail}`);

            } catch (error) {
                console.log(error.message)
                for (var err of error.errors || []) {
                    console.error(err.message)
                }
            }
        }
    )
};
