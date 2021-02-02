
/*
const express = require('express');
var dba = require('../service/DBService');

var router = express.Router()

router.get('/projects.xml', async function (req, res) {
    res.set('Content-Type', 'text/xml');

    const { create } = require('xmlbuilder');
    var root = create('projects.xml');

    var projects = await dba.getProjects();
    for(project of projects){
        root.root().ele('project',  {'ProjectName': project.get('project_name'),
                                    'ProjectID': project.get('ProjectID'),
                                    'participants': project.get('participants'),
                                    'link': process.env.GOOGLE_LINK + '&t=' + project.get('OFFSET') + 's',
                                    'Description': project.get('project_descr')
                                    }
                                );
    }
    const xml = root.end({ pretty: true});
    res.send(xml)
})

module.exports = router
router.get('/projectsNew.xml', async function (req, res) {
    res.set('Content-Type', 'text/xml');

    const { create } = require('xmlbuilder');
    var root = create('projectsNew.xml');

    var projects = await dba.getProjectsNew();
    for(project of projects){
        root.root().ele('project',  {'ProjectName': project.get('project_name'),
                                    'ProjectID': project.get('ProjectID'),
                                    'participants': project.get('participants'),
                                    'link': process.env.GOOGLE_LINK + '&t=' + project.get('OFFSET') + 's',
                                    'Description': project.get('project_descr')
                                    }
                                );
    }
    const xml = root.end({ pretty: true});
    res.send(xml)
})

module.exports = router
*/


