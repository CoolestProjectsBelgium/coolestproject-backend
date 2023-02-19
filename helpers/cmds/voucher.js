const DBA = require('../../dba');

exports.command = 'voucher';
exports.desc = 'Voucher related commands';

exports.builder = (yargs) => {
  yargs.command('create <userId>', 'Create voucher for project',
    () => { },
    async (argv) => {
      try {
        const voucher = await DBA.createVoucher(argv.userId);
        console.log(`Voucher created for user  ${argv.userId} token ${voucher.id}`);

      } catch (error) {        
        console.log('voucher.js:');
        console.log(error.message);
        for (var err of error.errors || []) {
          console.error(err.message);
        }
      }
    }
  );
};