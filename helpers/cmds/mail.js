const Mail = require('nodemailer/lib/mailer');
const DBA = require('../../dba');
const Mailer = require('../../mailer');

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
};
