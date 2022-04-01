const express = require('express');

var cors = require('cors')
const models = require('../models');

const Sequelize = require('sequelize');
const passport = require('passport');

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
  function (username, password, done) {
    console.log(username)
    console.log(password)
    /*
    User.findOne({ username: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      if (!user.verifyPassword(password)) { return done(null, false); }
      return done(null, user);
    });*/

    return done(null, { id: '1', name: username });
  }
));

passport.use(new JwtStrategy({
  secretOrKey: secretOrPublicKey,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
}, (payload, done) => {
  console.log(payload)
  return done(null, payload.user);
}));

router.post('/auth/login', passport.authenticate('json'), async function (req, res) {
  const token = jwt.sign({ user: req.user }, secretOrPublicKey);
  res.status(200).json({'jwt': token});
});

router.post('/auth/logout', passport.authenticate('jwt'), async function (req, res) {
  res.send('success');
});

router.get('/auth/user', passport.authenticate('jwt'), async function (req, res) {
  res.json({
    user: req.user 
  });
});

router.get('/projects', passport.authenticate('jwt'), async function (req, res) {
  // get random project
  res.json(
    { project_id: 1, 
      title: 'title', 
      description: 'description', 
      categories: [
        {title:'category 1', id:1, value:5, max:5}, 
        {title:'category 2', id:2, value:5, max:10}, 
        {title:'category 3', id:3, value:5, max:5} 
      ] 
    }
  );
});

router.post('/projects/:projectId', passport.authenticate('jwt'), async function (req, res) {
  // save vote
  console.log(req.params.projectId)
  console.log(req.user.id)
  console.log(req.body)
});

module.exports = router;  
