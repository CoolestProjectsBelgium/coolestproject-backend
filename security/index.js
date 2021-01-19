'use strict';

const passport = require('passport')
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const DBA = require('../dba');
const Token = require('../jwts');
const Mail = require('../mailer');

module.exports = function (app) {
    app.use(passport.initialize());
    app.use(passport.session());

    const opts = {}
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
    opts.secretOrKey = process.env.SECRET_KEY;
    passport.use(new JwtStrategy(opts, async function (jwt_payload, done) {
        try {
            // user login
            let user = null;
            if (jwt_payload.id !== undefined) {
                user = await DBA.getUser(jwt_payload.id);
                if (user == null) {
                    return done('User not found', false);
                }

                // create user
            } else if (jwt_payload.registrationId !== undefined) {
                user = await DBA.createUserFromRegistration(jwt_payload.registrationId)
                if (user == null) {
                    return done('User not found', false);
                }
                const event = await user.getEvent();
                const token = await Token.generateLoginToken(user.id);
                const project = await DBA.getProject(user.id);

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

    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(async function (id, done) {
        try {
            const user = await DBA.getUser(user.id);
            return done(null, user);
        } catch (err) {
            return done(err, false);
        }
    });

    // secure 
    app.use('/projectinfo', passport.authenticate('jwt'))
    app.use('/participants', passport.authenticate('jwt'))
    app.use('/login', passport.authenticate('jwt'))
    app.use('/userinfo', passport.authenticate('jwt'))
}



