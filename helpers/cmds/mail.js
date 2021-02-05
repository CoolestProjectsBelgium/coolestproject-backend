const DBA = require('../../dba');
const Mailer = require('../../mailer');
const Tokens = require('../../jwts');

exports.command = 'mail';
exports.desc = 'Mail related scripts';

exports.builder = (yargs) => {
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
        console.log(error.message);
        for (var err of error.errors || []) {
          console.error(err.message);
        }
      }
    }
  );
  yargs.command('ask4TokenMail <userid>', 'Send token mail',
    () => { },
    async (argv) => {
      try {
        const user = await DBA.getUser(argv.userid);
        const event = await DBA.getEventActive();
        const token = await Tokens.generateLoginToken(argv.userid);
        await Mailer.ask4TokenMail(user, token, event);
      } catch (error) {
        console.log('user:', argv.userid,error.message);
        for (var err of error.errors || []) {
          console.error(err.message);
        }
      }
    });
  yargs.command('welcomeMailOwner <userid>', 'Send welcome mail owner',
    () => { },
    async (argv) => {
      try {
        const user = await DBA.getUser(argv.userid);
        const event = await DBA.getEventActive();
        const project = await DBA.getProject(argv.userid);
        const mail = await Mailer.welcomeMailOwner(user, project, event);
        console.log(`Welcome mail owner was send ${mail}`);

      } catch (error) {
        console.log(error.message);
        for (var err of error.errors || []) {
          console.error(err.message);
        }
      }
    }

  );
  yargs.command('welcomeMailCoWorker <userid>', 'Send welcome mail CoWorker',
    () => { },
    async (argv) => {
      try {
        const user = await DBA.getUser(argv.userid);
        const event = await DBA.getEventActive();
        const project = await DBA.getProject(argv.userid);
        const mail = await Mailer.welcomeMailCoWorker(user, project, event);
        console.log(`Welcome mail coworker was send ${mail}`);

      } catch (error) {
        console.log(error.message);
        for (var err of error.errors || []) {
          console.error(err.message);
        }
      }
    }
  );
  yargs.command('deleteMail <userid>', 'Send delete mail CoWorker',
    () => { },
    async (argv) => {
      try {
        const user = await DBA.getUser(argv.userid);
        //console.log(`Delete0 mail coworker was send ${user}`);
        const event = await DBA.getEventActive();
        const project = await DBA.getProject(argv.userid);
        const mail = await Mailer.deleteMail(user, project, event);
        console.log(`Delete mail coworker was send ${mail}`);

      } catch (error) {
        //console.log('user:',argv.userid,error.message)
        console.log(error.message);
        for (var err of error.errors || []) {
          console.error(err.message);
        }
      }
    }
  );
    yargs.command('emailExistsMail <userid>', 'Send email exists Mail',
    () => { },
    async (argv) => {
     try {
      const user = await DBA.getUser(argv.userid);
      const mail = await Mailer.emailExistsMail(user.email, user.language);
      console.log(`email exists was send to:`, user.email, '/', user.language);
    } catch (error) {
      console.log(error.message);
      for (var err of error.errors || []) {
        console.error(err.message);
        }
      }
    }
  );
};
