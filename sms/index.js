const express = require('express');
const models = require('../models');
const PublicVote = models.PublicVote;
const bodyParser = require('body-parser');
const Sequelize = require('sequelize');
const crypto = require('crypto');

const Table = models.Table;
const Project = models.Project;
const Event = models.Event;


var router = express.Router();
router.use(bodyParser.urlencoded({ extended: false }));

/**
 * Called by the Twilio webhook whenever a SMS comes in
 * https://www.twilio.com/docs/messaging/guides/webhook-request
 */
router.post('/', async function (req, res, next) {

    console.log('** SMS Request coming in **');
    console.log('Body:', req.body.Body);

    const lookupRegex = /\d+/g;
    const tableNumber = lookupRegex.exec(req.body.Body)?.[0].padStart(2, '0')
    console.log('Table1:', tableNumber);

    if (!tableNumber) {
        console.log('No table detected!');
        res.status(200).send(); // Must respond as OK because Twilio should not retry
        return;
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
    console.log('Active Event:', activeEvent.id);

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
                    attributes: ['ProjectId']
                }
            }
        ]
    });
    const projectId = table?.Projects?.[0].id; // Just pick the first project
    if (!projectId) {
        console.log('Project not found!');
        res.status(200).send();
        return;
    }

    const phone = req.body.From || null;
    console.log('Phone:',phone)

    const sid = req.body.MessagingServiceSid;
    const expectedSid = process.env.TWILIO_SID; // After setting in configuration.env, reboot container/machine
    console.log(sid, expectedSid)

    if (sid != expectedSid) {
        console.log('Unexpected sender - abort');
        res.status(403).send('Unexpected sender'); // Here it is OK to send status, as Twilio should retry or fix config
        return;
    }

    const md5 = crypto.createHash('md5');
    var hash = md5.update(phone).digest('hex');
    console.log('Phone hash:', hash);

    try {
        await PublicVote.create({ phone: hash, projectId: projectId });
    } catch (e) {
        if (e.name === 'SequelizeUniqueConstraintError') {
            console.log('Double vote');
            res.status(202).send();
            return;
        } else {
            throw e;
        }
    }

    // Success
    res.status(200).send();
});

module.exports = router;
