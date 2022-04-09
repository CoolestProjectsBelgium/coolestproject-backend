const express = require('express');

var cors = require('cors');
const models = require('../models');

const Sequelize = require('sequelize');
const passport = require('passport');

const VoteCategory = models.VoteCategory;
const Project = models.Project;
const Account = models.Account;

const secretOrPublicKey = 'StRoNGs3crE7';

const JsonStrategy = require('passport-json').Strategy;
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

var router = express.Router();
router.use(passport.session());
router.use(bodyParser.json());
router.use(passport.initialize());

passport.use(new JsonStrategy(
  async function (username, password, done) {
    const account = await Account.findOne({ where: { email: username, account_type: 'jury' } });

    if (!account) { return done(null, false); }
    //if (!account.verifyPassword(password)) { return done(null, false); }
    return done(null, {id: account.id, email: account.email, user: account.email});
    
    /*
    console.log(username);
    console.log(password);
    
    User.findOne({ username: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      if (!user.verifyPassword(password)) { return done(null, false); }
      return done(null, user);
    });*/

    //return done(null, { id: account.id, name: account.email });
  }
));

passport.use(new JwtStrategy({
  secretOrKey: secretOrPublicKey,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
}, (payload, done) => {
  console.log(payload);
  return done(null, payload.user);
}));

router.post('/auth/login', passport.authenticate('json'), async function (req, res) {
  console.log(req.user);

  const account = await Account.findByPk(req.user.id);
  console.log(account);
  if(!account) {
    res.status(403);
    return;
  }
  const token = jwt.sign({ id: account.id, email: account.email, user: account.email }, secretOrPublicKey);
  res.status(200).json({'jwt': token});
});

router.post('/auth/logout', passport.authenticate('jwt'), async function (req, res) {
  res.send('success');
});

router.get('/auth/user', passport.authenticate('jwt'), async function (req, res) {
  const account = await Account.findByPk(req.user.id);
  res.json({
    id: account.id,
    email: account.email,
    user: account.email
  });
});

router.get('/projects', passport.authenticate('jwt'), async function (req, res) {
  // get random project
  //load categories

  const projects = await Project.findAll({
    limit: 5,
    attributes: {
      include: [
        [
          Sequelize.literal(`(
                    SELECT COUNT(*)
                    FROM Votes AS vote
                    WHERE vote.projectId = Project.id )`),
          'votesRecieved'
        ]
      ]
    },
    order: [
      [Sequelize.literal('votesRecieved'), 'DESC']
    ]
  });

  const randomProject = projects[Math.floor(Math.random() * projects.length)];

  const categories = await VoteCategory.findAll({
    attributes: ['name', 'max', 'optional'],
    where: {
      eventId: 1
    }
  });

  res.json(
    { project_id: randomProject.id, 
      title: randomProject.project_name, 
      description: randomProject.project_descr, 
      language: randomProject.project_lang, 
      categories: categories 
    }
  );
});

router.post('/projects/:projectId', passport.authenticate('jwt'), async function (req, res) {
  // save vote
  console.log(req.params.projectId);
  console.log(req.user.id);
  console.log(req.body);
});

module.exports = router;  
