'use strict';

const passport = require('passport')
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const DBA = require('../dba');
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
            if (jwt_payload.id !== undefined) {
                user = await DBA.getUser(jwt_payload.id);
                
                // create user
            } else if (jwt_payload.registrationId !== undefined) {
                let userId = -1;
                // get registration
                const registration = await DBA.getRegistration(jwt_payload.registrationId);
                // no registration found in our table (already created)
                if (registration === null) {
                    return done(null, false);
                }
                if (registration.project_code) {
                    // create user and add to existing project
                    participant = await DBA.createUserWithVoucher(
                        {
                            language: registration.language,
                            postalcode: registration.postalcode,
                            email: registration.email,
                            gsm: registration.gsm,
                            firstname: registration.firstname,
                            lastname: registration.lastname,
                            sex: registration.sex,
                            birthmonth: registration.birthmonth,
                            mandatory_approvals: registration.mandatory_approvals,
                            t_size: registration.t_size,
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
                            language: registration.language,
                            postalcode: registration.postalcode,
                            email: registration.email,
                            gsm: registration.gsm,
                            firstname: registration.firstname,
                            lastname: registration.lastname,
                            sex: registration.sex,
                            birthmonth: registration.birthmonth,
                            mandatory_approvals: registration.mandatory_approvals,
                            t_size: registration.t_size,
                            via: registration.via,
                            medical: registration.medical,
                            gsm_guardian: registration.gsm_guardian,
                            email_guardian: registration.email_guardian,
                            general_questions: registration.general_questions,
                            project: {
                                project_name: registration.project_name,
                                project_descr: registration.project_descr,
                                project_type: registration.project_type,
                                project_lang: registration.project_lang
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
            if (owner) {
                const project = await DBA.getProject(user.id);
                Mail.welcomeMailOwner(owner, project, event);
            } else if (participant) {
                Mail.welcomeMailCoWorker(participant, project, event);
            }

            // check if user is found
            if (user) {
                return done(null, user);
            } else {
                return done(null, false);
            }

        } catch (err) {
            return done(err, false);
        }
    }));

    passport.serializeUser(function (user, done) {
        console.log(user)
        done(null, user.id);
    });

    passport.deserializeUser(async function (id, done) {
        console.log(id)
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



