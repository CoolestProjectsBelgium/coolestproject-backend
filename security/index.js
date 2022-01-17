'use strict';

const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const AnonymousStrategy = require('passport-anonymous').Strategy;
const Azure = require('../azure');

const DBA = require('../dba');

const database = new DBA(Azure);

const Token = require('../jwts');
const Mail = require('../mailer');

const cookieExtractor = function (req) {
  var token = null;
  if (req && req.cookies) {
    token = req.cookies['jwt'];
  }
  return token;
};

module.exports = function (app) {
  app.use(passport.initialize());
  app.use(passport.session());

  const opts = {};
  opts.jwtFromRequest = ExtractJwt.fromExtractors([ExtractJwt.fromAuthHeaderAsBearerToken(), cookieExtractor]);
  opts.secretOrKey = process.env.SECRET_KEY;
  passport.use(new JwtStrategy(opts, async function (jwt_payload, done) {
    try {
      // user login
      let user = null;
      if (jwt_payload.id !== undefined) {
        user = await database.getUser(jwt_payload.id);
        if (!user) {
          return done('User not found', false);
        }
        const event = await user.getEvent();
        if (event.closed) {
          return done(null, false, { message: 'Event is closed no login possible' });
        }

        // create user
      } else if (jwt_payload.registrationId !== undefined) {
        user = await database.createUserFromRegistration(jwt_payload.registrationId);
        if (!user) {
          return done('User not found', false);
        }
        const event = await user.getEvent();
        if (event.closed) {
          return done(null, false,  { message: 'Event is closed no login possible' });
        }
        const token = await Token.generateLoginToken(user.id);
        const project = await database.getProject(user.id);

        // send welcome mails if user is new
        if (project.ownerId == user.id) {
          Mail.welcomeMailOwner(user, project, event, token);
        } else {
          Mail.welcomeMailCoWorker(user, project, event, token);
        }
      }
      return done(null, user);

    } catch (err) {
      return done(err, false);
    }
  }));
  passport.use(new AnonymousStrategy());

  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(async function (id, done) {
    try {
      const user = await database.getUser(user.id);
      return done(null, user);
    } catch (err) {
      return done(err, false);
    }
  });

  // secure 
  app.use('/projectinfo', passport.authenticate('jwt'));
  app.use('/participants', passport.authenticate('jwt'));
  app.use('/login', passport.authenticate('jwt'));
  app.use('/logout', passport.authenticate('jwt'));
  app.use('/userinfo', passport.authenticate('jwt'));
  app.use('/attachments', passport.authenticate('jwt'));

  //optional
  app.use('/questions', passport.authenticate(['jwt', 'anonymous']));
  app.use('/tshirts', passport.authenticate(['jwt', 'anonymous']));
  app.use('/settings', passport.authenticate(['jwt', 'anonymous']));
  app.use('/approvals', passport.authenticate(['jwt', 'anonymous']));

  //voting
  app.use('/api/auth/login', passport.authenticate(['anonymous']));
  app.use('/api/auth/logout', passport.authenticate(['anonymous']));
  app.use('/api/auth/user', passport.authenticate(['anonymous']));

};



