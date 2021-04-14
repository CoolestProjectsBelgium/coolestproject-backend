

const express = require('express');
const models = require('../models');
const Project = models.Project;
const User = models.User;
const Voucher = models.Voucher;
const Hyperxlink = models.Hyperxlink;
const Attachment = models.Attachment;
const Hyperlink = models.Hyperlink;

var router = express.Router()

router.get('/projects.xml', async function (req, res) {
    res.set('Content-Type', 'text/xml');
    const { create } = require('xmlbuilder');

    var root = create('projects.xml');
    //var projects = await Project.findAll();
    let vouchers = [];

    var projects = await Project.findAll(
         { model: User, as: 'participant' }, { model: User, as: 'owner' });

    console.log("======================>all:",projects);

    for(project of projects){
        let link = null
        let part = null

        let owner = await project.getOwner()
        let participants = await project.getParticipant()


       // console.log("owner:",owner.dataValues.lastname);
       // console.log("part:",participants);

        const hyperx = await Hyperxlink.findOne({ where: { ProjectId: project.dataValues.id } });
        const userId = project.dataValues.ownerId;
        //const users = await User.findByPk(userId);
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
                                    //'participants': part,
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
/*
router.get('/projectsNew.xml', async function (req, res) {
    res.set('Content-Type', 'text/xml');

    const { create } = require('xmlbuilder');
    var root = create('projectsNew.xml');

    var projects = await dba.getProjects();
    for(project of projects){
        root.root().ele('project',  {'ProjectName': project.get('project_name'),
                                    'ProjectID': project.get('ProjectID'),
                                    'participants': project.get('participants'),
                                    //'link': process.env.GOOGLE_LINK + '&t=' + project.get('OFFSET') + 's',
                                    'Description': project.get('project_descr')
                                    }
                                );
    }
    const xml = root.end({ pretty: true});
    res.send(xml)
})

module.exports = router

*/

