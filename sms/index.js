const express = require('express');
const models = require('../models');
const PublicVote = models.PublicVote;
const bodyParser = require('body-parser');
const Sequelize = require('sequelize');


const Table = models.Table;
const Project = models.Project;

var router = express.Router();
router.use(bodyParser.urlencoded({ extended: false })); // for SMS

/**
 * Called by the Twilio webhook whenever a SMS comes in
 * https://www.twilio.com/docs/messaging/guides/webhook-request
 */
router.post('/', async function (req, res, next) {

    console.log(req.body);

    const lookupRegex = /\d+/g;
    const tableNumber = lookupRegex.exec(req.body.Body)?.[0].padStart(2, '0')

    if (!tableNumber) {
        console.log('no table found');
    }

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

    const table = await Table.findOne({
        where: {
            eventId: activeEvent.id,
            name: {
                [Sequelize.Op.like]: '%' + tableNumber
            }
        },
        include: [
            {
                model: Project,
                required: true,
                through: {
                    attributes: []
                }
            }
        ]
    });

    const projectId = table.Projects?.[0].id; //just pick the first project

    //const project = await database.getProjectById(projectId);
    const phone = req.body.From || null;

    const sid = req.body.MessagingServiceSid;
    const expectedSid = process.env.TWILIO_SID; // does not work: undefined

    console.log(sid);
    console.log(expectedSid);

    /*   if (sid != expectedSid) {
        res.status(403).send("Unexpected sender");
        return;
      } */

    console.log(phone);
    const crypto = require('crypto');
    const md5 = crypto.createHash('md5'); // for SMS
    var hash = md5.update(phone).digest('hex');
    console.log(hash);

    if (!projectId) {
        res.status(202).send("unknown project");
        return;
    }

    try {
        var pv = await PublicVote.create({ phone: hash, projectId: projectId });
    } catch (e) {
        if (e.name === 'SequelizeUniqueConstraintError') {
            res.status(202).send("double vote");
            return;
        } else {
            throw e;
        }
    }

    // Success
    res.status(200).send("success");
});

module.exports = router; 