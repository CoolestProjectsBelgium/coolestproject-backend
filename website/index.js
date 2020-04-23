
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
            root.root().ele('project',  {'name': project.project_name, 'owner': project.owner_name, 'participants': project.participants});
        }
    );
    const xml = root.end({ pretty: true});
    res.send(xml)
})

module.exports = router


