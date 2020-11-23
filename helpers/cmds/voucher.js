const dba = require('../../dba');

exports.command = `voucher`
exports.desc = `Voucher related commands`

exports.builder = (yargs) => {
    yargs.command('create <userId>', 'Create voucher for project',
        (yargs) => {
            //yargs.option('userId', { type: "number" })
        },
        async (argv) => {
            try {
                const voucher = await dba.createVoucher(argv.userId);
                console.log(`Voucher created for user  ${argv.userId} token ${voucher.id}`);

            } catch (error) {
                console.log(error.message)
                for (var err of error.errors || []) {
                    console.error(err.message)
                }
            }
        }
    )
};