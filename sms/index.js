const express = require('express');
const models = require('../models');
const PublicVote = models.PublicVote;
const bodyParser = require('body-parser');

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

    if(!tableNumber){
        console.log('no table found');
    }

   const table = await Table.findOne({
        where: { 
            name: {
                [Sequelize.Op.like]: '%' + tableNumber
            } 
        }, 
        include: [ 
            { model: Project } 
        ]
    });

    const projectId = table.projects?.[0].id;
    const project = await database.getProjectById(projectId);
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

    if (!project) {
        res.status(202).send("unknown project");
        return;
    }

    try {
        var pv = await PublicVote.create({ phone: hash, projectId: project.id });
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