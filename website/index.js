
const express = require('express');
var dba = require('../service/DBService');

var router = express.Router()

router.get('/projects', async function (req, res) {
    res.set('Content-Type', 'text/xml');

    const { create } = require('xmlbuilder');
    var root = create('projects');

    var projects = await dba.getProjects();
    for(project of projects){
        root.root().ele('project',  {'ProjectName': project.get('project_name'),
                                    'ProjectId': project.get('projectid'), 
                                    'ProjectOwner': project.get('owner_name'), 
                                    'Participants': project.get('participants'), 
                                    'link': process.env.GOOGLE_LINK + '&t=' + project.get('offset') + 's'});
    }
    const xml = root.end({ pretty: true});
    res.send(xml)
})

module.exports = router


