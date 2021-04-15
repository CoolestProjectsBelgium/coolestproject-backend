

const express = require('express');
var cors = require('cors')
const models = require('../models');
const Project = models.Project;
const Attachment = models.Attachment;
const Hyperlink = models.Hyperlink;
const User = models.User;
const Table = models.Table;
 
var router = express.Router(); 

router.get('/projects.xml', cors(), async function (req, res) {
  res.set('Content-Type', 'text/xml');

  const { create } = require('xmlbuilder');
  var root = create('projects.xml');

  var projects = await Project.findAll(
    { order: [[Attachment,'createdAt', 'desc']], include:[{ model: Attachment, where: { confirmed: true }, required: false,  include: [ Hyperlink ] }, { model: User, as: 'participant' }, { model: User, as: 'owner' }]});
  
  for(let project of projects){
    let owner = await project.getOwner()
    let participants = await project.getParticipant()
    let attachments = await project.getAttachments()

    root.root().ele('project', {
      'ProjectName': project.get('project_name'),
      'ProjectID': project.get('id'),
      'participants': [owner].concat(participants).map((ele) => { return ele.get('firstname') + ' ' + ele.get('lastname') } ).join(','),
      'link': (await attachments[0]?.getHyperlink())?.get('href'),
      'Description': project.get('project_descr')
    });
  }
  const xml = root.end({ pretty: true});
  res.send(xml);
  
});

router.get('/projects.json', cors(), async function (req, res) {
  var projects = await Project.findAll(
    { order: [[Attachment,'createdAt', 'desc']], include:[{ model: Table }, { model: Attachment, where: { confirmed: true }, required: false,  include: [ Hyperlink ] }, { model: User, as: 'participant' }, { model: User, as: 'owner' }]});
  
  var response = []  
  for(let project of projects){
    let owner = await project.getOwner()
    let participants = await project.getParticipant()
    let attachments = await project.getAttachments()
    let table = await project.getTables()

    response.push({
      'projectName': project.get('project_name'),
      'projectID': project.get('id'),
      'participants': [owner].concat(participants).map((ele) => { return ele.get('firstname') + ' ' + ele.get('lastname') } ).join(', '),
      'link': (await attachments[0]?.getHyperlink())?.get('href'),
      'location': table[0]?.location,
      'place': table[0]?.name,
      'usedPlaces': table[0]?.ProjectTable.get('usedPlaces'),
      'description': project.get('project_descr')
    })
  }
  res.json(response);
});

module.exports = router;
