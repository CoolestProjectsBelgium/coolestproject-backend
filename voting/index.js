const express = require('express');

// CORS: configuration is in app.js in the root

const models = require('../models');

const Sequelize = require('sequelize');
const passport = require('passport');

const VoteCategory = models.VoteCategory;
const Project = models.Project;
const Account = models.Account;
const Vote = models.Vote;
const Table = models.Table;
const Event = models.Event;
const secretOrPublicKey = process.env.VOTING_KEY;

console.log('PassportJwtSecret (VOTING-KEY): %s', secretOrPublicKey);

const JsonStrategy = require('passport-json').Strategy;
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const router = express.Router();
router.use(passport.session());
router.use(bodyParser.json());
router.use(passport.initialize());

passport.use('voting_login', new JsonStrategy(
  async function (username, password, done) {
    try {
      const account = await Account.findOne({ where: { email: username, account_type: 'jury' } });
      if (!account) { 
        return done(null, false); 
      }
      if (!account.verifyPassword(password)) { 
        return done(null, false); 
      }
      return done(null, {id: account.id, email: account.email, user: account.email});
    } catch (error) {
      return done(null, false);
    }
  }
));

passport.use('voting', new JwtStrategy({
  secretOrKey: secretOrPublicKey,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
}, (payload, done) => {
  console.log('payload:',payload);
  return done(null, payload);
}));

router.post('/auth/login', passport.authenticate('voting_login'), async (req, res) => {
    console.log('user:',req.user);

    const account = await Account.findByPk(req.user.id);
    console.log('account:',account);
    if (!account) {
      res.status(403);
      return;
    }

    const token = jwt.sign({ id: account.id, email: account.email }, secretOrPublicKey, { expiresIn: '12h' });
    res.status(200).json({ 'jwt': token });
  });

router.post('/auth/logout', passport.authenticate('voting'), async (_req, res) => {
    res.send(null);
  });

router.get('/auth/user', passport.authenticate('voting'), async (req, res) => {
    const account = await Account.findByPk(req.user.id);
    res.json({
      user: { id: account.id, name: account.email }
    });
  });

router.get('/languages', passport.authenticate('voting'), async (_req, res) => {
    res.json([{ id: 'nl', text: 'Dutch' }, { id: 'fr', text: 'French' }, { id: 'en', text: 'English' }]);
  });

router.get('/projects', passport.authenticate('voting'), async (req, res) => {

    let languages = ['nl', 'fr', 'en'];
    console.log('query:', req.query);
    try {
      languages = JSON.parse(req.query.languages);

    } catch (e) { }

    let skipProjectId = null;
    try {
      skipProjectId = JSON.parse(req.query.skipProject);

    } catch (e) { }

    const activeEvent = await Event.findOne({
      where: {
        eventBeginDate: {
          [Sequelize.Op.lt]: Sequelize.literal('CURDATE()'),
        },
        eventEndDate: {
          [Sequelize.Op.gt]: Sequelize.literal('CURDATE()'),
        }
      },
      attributes: ['id']
    });

    // get random project
    //load categories
    const randomProject = await Project.findOne({
      limit: 1,
      where: {
        id: {
          [Op.and]: {
            [Sequelize.Op.notIn]: Sequelize.literal(`(SELECT DISTINCT vote.projectId FROM Votes AS vote WHERE vote.accountId = ${req.user.id})`),
            [Sequelize.Op.ne]: skipProjectId
          }
        },
        eventId: activeEvent.id,
        project_lang: {
          [Sequelize.Op.in]: languages
        }
      },
      include:[
        {
          model: Table,
          required: true
        }
      ],
      attributes: {
        include: [
          [
            Sequelize.literal('(SELECT COUNT(*) FROM Votes AS vote WHERE vote.projectId = Project.id )'),
            'votesReceived'
          ],
        ]
      },
      order: [
        [Sequelize.literal('votesReceived'), 'ASC'], // Lowest on top
        [Sequelize.literal('rand()')] // Within the lowest, order randomly
      ]
    });
    
    if (!randomProject) {
      res.json({ message: 'finished' });
      return;
    }

    const location = (await randomProject.getTables())?.[0]?.name;
    console.log('Location:', location);
    const categories = await VoteCategory.findAll({
      attributes: ['name', 'max', 'optional', 'id'],
      where: {
        eventId: activeEvent.id
      }
    });

    res.json(
      {
        project_id: randomProject.id,
        title: randomProject.project_name,
        description: randomProject.project_descr,
        language: randomProject.project_lang,
        categories: categories,
        location: location || 'No location'
      }
    );
  });

router.post('/projects/:projectId', passport.authenticate('voting'), async (req, res) => {
    const activeEvent = await Event.findOne({
      where: {
        eventBeginDate: {
          [Sequelize.Op.lt]: Sequelize.literal('CURDATE()'),
        },
        eventEndDate: {
          [Sequelize.Op.gt]: Sequelize.literal('CURDATE()'),
        }
      },
      attributes: ['id']
    });

    const votes = [];
    for (const v of req.body) {
      //TODO add mandatory fill in check
      votes.push({ categoryId: v.id, projectId: req.params.projectId, accountId: req.user.id, amount: v.value || 0, eventId: activeEvent.id });
    }
    await Vote.bulkCreate(votes);
    res.send(null);
  });

module.exports = router;  
