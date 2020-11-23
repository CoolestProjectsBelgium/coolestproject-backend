const dba = require('../../dba');

exports.command = 'account <name> <password>'
exports.desc = 'Create Account <name> <password> for access to backend applications'
exports.builder = {}
exports.handler = async function (argv) {
    try {
        const admin = await dba.createAccount(
            {
                email: argv.name,
                password: argv.password,
            }
        )
        console.log('created Account: ' + admin.email);

    } catch (error) {
        for (var err of error.errors) {
            console.error(err.message)
        }
    }
}
