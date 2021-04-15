

const express = require('express');
const models = require('../models');
const Project = models.Project;
const User = models.User;
const Voucher = models.Voucher;
const Hyperxlink = models.Hyperxlink;
var router = express.Router()

router.get('/projects.xml', async function (req, res) {
    res.set('Content-Type', 'text/xml');
    const { create } = require('xmlbuilder');
    var root = create('projects.xml');
    let vouchers = [];

    var projects = await Project.findAll(
         { model: User, as: 'participant' }, { model: User, as: 'owner' });

    for(project of projects){
        let link = null
        let part = null

        let owner = await project.getOwner()
        let participants = await project.getParticipant()

        const hyperx = await Hyperxlink.findOne({ where: { ProjectId: project.dataValues.id } });
        const userId = project.dataValues.ownerId;

        link = "empty";
        part = "empty";
        if(hyperx){
             link =  hyperx.get('URL');
        }  
         vouchers = await Voucher.findAll({
           where: { projectId: project.dataValues.id }, attributes: ['participantId'], include: [{
             model: User,
             as: 'participant',
             attributes: ['firstname', 'lastname']
           }]
         });
        root.root().ele('project',  {'ProjectName': project.get('project_name'),
                                    'ProjectID': project.get('id'),
                                    'participants': [owner].concat(participants).map((ele) => { return ele.get('firstname') + ' ' + ele.get('lastname') } ).join(','),
                                    'link': link,
                                    'Description': project.get('project_descr')
                                    }
                                );
    }
    const xml = root.end({ pretty: true});
    res.send(xml)
})

module.exports = router