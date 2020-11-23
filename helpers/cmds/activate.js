const dba = require('../../dba');

exports.command = `activate`
exports.desc = `Create Account via registration`

exports.builder = (yargs) => {
    yargs.option('registrationId', { type: "number" })
};
exports.handler = async function (argv) {
    try {
        // create registration with own project
        const user = await dba.createUserFromRegistration(argv.registrationId);
        console.log('User with id ' + user.id + ' created from registration id ' + argv.registrationId);

    } catch (error) {
        for (var err of error.errors) {
            console.error(err.message)
        }
    }
}