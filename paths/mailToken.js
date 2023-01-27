module.exports = function(models, database, mailer, jwt) {
  const logger = require('pino')();
  const addSeconds = require('date-fns/addSeconds');

  const operations = {
    post
  };
  
  async function post(req, res) {
    let counter = 0;
    const login = req.body;
    let users = await database.getUsersViaMail(login.email);
    for (const user of users) {
      console.log('User found:', user.id);
      const event = await user.getEvent();
      if (event.closed) {
        console.log('But event is closed.');
        continue; // jump to the next found user
      }
      // only one token every n seconds
      let tokenTime = -1;
      if (user.last_token !== null) {
        tokenTime = addSeconds(user.last_token, process.env.TOKEN_RESEND_TIME || 0);
      }
      if (new Date() > tokenTime) {
        // generate new token for user
        await database.updateLastToken(user.id);
        const token = await jwt.generateLoginToken(user.id);
        await mailer.ask4TokenMail(user, token, event);
        counter++;
        console.log('Token email send for:', user.email);
      } else {
        counter++;
        console.log('Token requested but time is not passed yet:', user.email);
      }
    }
    if (counter==0) {
      console.log('No user found for:', login.email);
    }
    res.status(200).send(null);
  }
      
  return operations;
};