module.exports = function(models, database, mailer, jwt) {
  const logger = require('pino')();
  const addSeconds = require('date-fns/addSeconds');

  const operations = {
    POST
  };
      
  async function POST(req, res) {
    const login = req.body;
    var users = await database.getUsersViaMail(login.email);
    for (const user of users) {
      logger.info('user found: ' + user.id);
      const event = await user.getEvent();
      if (event.closed) {
        logger.info('event is closed');
        continue; // jump to the next found user
      }
      // only one token every n seconds
      var tokenTime = -1;
      if (user.last_token !== null) {
        tokenTime = addSeconds(user.last_token, process.env.TOKEN_RESEND_TIME || 0);
      }
      if (new Date() > tokenTime) {
        // generate new token for user
        await database.updateLastToken(user.id);
        const token = await jwt.generateLoginToken(user.id);
        await mailer.ask4TokenMail(user, token, event);
        logger.info('Token email send');
      } else {
        logger.info('Token requested but time is not passed yet: ' + user.email);
      }
    }

    res.status(200).send(null);
  }
      
  return operations;
};