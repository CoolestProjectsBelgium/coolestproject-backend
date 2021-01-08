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
            let participant = null;
            let owner = null;
            let userId = -1;
            if (jwt_payload.id !== undefined) {
                user = await DBA.getUser(jwt_payload.id);
                if (user == null) {
                    return done('User not found', false);
                }

                // create user
            } else if (jwt_payload.registrationId !== undefined) {
                // get registration
                const registration = await DBA.getRegistration(jwt_payload.registrationId);
                if (registration == null) {
                    return done('Registration not found', false);
                }

                if (registration.project_code) {
                    // create user and add to existing project
                    participant = await DBA.createUserWithVoucher(
                        {
                            eventId: registration.eventId,
                            language: registration.language,
                            postalcode: registration.postalcode,
                            email: registration.email,
                            gsm: registration.gsm,
                            firstname: registration.firstname,
                            lastname: registration.lastname,
                            sex: registration.sex,
                            birthmonth: registration.birthmonth,
                            mandatory_approvals: registration.mandatory_approvals,
                            sizeId: registration.sizeId,
                            via: registration.via,
                            medical: registration.medical,
                            gsm_guardian: registration.gsm_guardian,
                            email_guardian: registration.email_guardian,
                            general_questions: registration.general_questions
                        },
                        registration.project_code,
                        registration.id
                    );
                    userId = participant.id
                } else {
                    // create user with project
                    owner = await DBA.createUserWithProject(
                        {
                            eventId: registration.eventId,
                            language: registration.language,
                            postalcode: registration.postalcode,
                            email: registration.email,
                            gsm: registration.gsm,
                            firstname: registration.firstname,
                            lastname: registration.lastname,
                            sex: registration.sex,
                            birthmonth: registration.birthmonth,
                            mandatory_approvals: registration.mandatory_approvals,
                            sizeId: registration.sizeId,
                            via: registration.via,
                            medical: registration.medical,
                            gsm_guardian: registration.gsm_guardian,
                            email_guardian: registration.email_guardian,
                            general_questions: registration.general_questions,
                            project: {
                                project_name: registration.project_name,
                                project_descr: registration.project_descr,
                                project_type: registration.project_type,
                                project_lang: registration.project_lang,
                                max_tokens: registration.max_tokens
                            }
                        },
                        registration.id
                    );
                    userId = owner.id;
                }
                // return the newly created user
                user = await DBA.getUser(userId);
            }

            // send welcome mails if user is new
            const event = await DBA.getEventActive();
            if (event == null) {
                return done('Event not active', false);
            }

            const token = await Token.generateLoginToken(userId);
            const project = await DBA.getProject(user.id);
            if (owner) {
                Mail.welcomeMailOwner(owner, project, event, token);
            } else if (participant) {
                Mail.welcomeMailCoWorker(participant, project, event, token);
            }

            // check if user is found
            if (user) {
                return done(null, user);
            } else {
                return done('User not found', false);
            }

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

    app.use('/projectinfo', passport.authenticate('jwt'))
    app.use('/participants', passport.authenticate('jwt'))
    app.use('/login', passport.authenticate('jwt'))
    app.use('/userinfo', passport.authenticate('jwt'))
}



