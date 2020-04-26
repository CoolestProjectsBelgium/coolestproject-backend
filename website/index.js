
const express = require('express');
var dba = require('../service/DBService');

var router = express.Router()

router.get('/projects', async function (req, res) {
    res.set('Content-Type', 'text/xml');

    const { create } = require('xmlbuilder');
    var root = create('projects');

    var projects = await dba.getProjects();
    projects.every(
        function (project) {
            console.log("Project:"+project.project_name);
            root.root().ele('project',  {'name': project.project_name, 
                                        'pid':project.projectid, 
                                        'owner': project.owner_name, 
                                        'participants': project.participants,
                                        'YouTubeLink': project.youtube});
        }
    );
    const xml = root.end({ pretty: true});
    res.send(xml)
})

module.exports = router


