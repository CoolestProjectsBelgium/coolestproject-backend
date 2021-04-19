const express = require('express');
var cors = require('cors')
const models = require('../models');
const Project = models.Project;
const Location = models.Location;
const Attachment = models.Attachment;
const Hyperlink = models.Hyperlink;
const User = models.User;
const Table = models.Table;
const Sequelize = require('sequelize')

var router = express.Router(); 

var corsOptions = {
  origin: process.env.WEBSITEURL,
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

router.get('/projects.xml', cors(corsOptions), async function (req, res) {
  const { create } = require('xmlbuilder');
  var root = create('projects.xml');

  var projects = await Project.findAll();
  
  for(let project of projects){
    let owner = await project.getOwner()
    let participants = await project.getParticipant()
    let attachments = await project.getAttachments({where:{confirmed:true}})

    root.root().ele('project', {
      'Language': project.get('project_lang'),
      'ProjectName': project.get('project_name'),
      'ProjectID': project.get('id'),
      'participants': [owner].concat(participants).map((ele) => { return ele.get('firstname') + ' ' + ele.get('lastname') } ).join(', '),
      'link': (await attachments[0]?.getHyperlink())?.get('href'),
      'Description': project.get('project_descr') 
    });
  }
  const xml = root.end({ pretty: true});
  res.set('Content-Type', 'text/xml');
  res.send(xml);
  
});

router.get('/projects.json', cors(corsOptions), async function (req, res) {
  var projects = await Project.findAll();
  
  var response = []
  for(let project of projects){
    let owner = await project.getOwner()
    let participants = await project.getParticipant()
    let attachments = await project.getAttachments({where:{confirmed:true}})
    let table = await project.getTables()

    response.push({
      'projectName': project.get('project_name'),
      'Language': project.get('project_lang'),
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

router.get('/planning', cors(corsOptions), async function (req, res) {
  // create a planning table structure 
  // x -> list of locations
  // y -> list of table
  // z -> list of projects
  const locations = await Location.findAll()
  const locationsCount = await Location.count()
  const tablesGroupedCount = await Table.findAll(
    {
      attributes: ['LocationId', [Sequelize.fn('count', Sequelize.col('LocationId')), 'count']],
      group: ['LocationId']
    }
  )
  // we need header values in the first row so + 1 for length
  const maxTablesCount = Math.max(...tablesGroupedCount.map(o => o.get('count')), 0) + 1;

  const result = Array(maxTablesCount).fill().map(() => Array(locationsCount));
  for (const [i, location] of locations.entries()) {
    result[0][i] = {
      name: location.get('text'),
      header: true 
    }

    let tables = await location.getTables()
    for (const [j, table] of tables.entries()) {
      let projectList = []
      let projects = await table.getProjects()
      for(let project of projects){
        let participantsList = []
        let owner = await project.getOwner()
        let agreedToPhoto = true
        if(owner){
          participantsList.push(owner)
          let questions = await owner.getQuestions()
          agreedToPhoto = agreedToPhoto && questions.some((ele) => { return ele.name == 'Agreed to Photo' })
        }
        let participants = await project.getParticipant()
        if(participants){
          for(let participant of participants){
            let questions = await participant.getQuestions()
            agreedToPhoto = agreedToPhoto && questions.some((ele) => { return ele.name == 'Agreed to Photo' })
          }
          participantsList.push(...participants)
        } 

        let attachments = await project.getAttachments({ where: { confirmed: true } })
        
        let cardStyle = ''
        if(!agreedToPhoto){
          cardStyle = 'border-danger'
        } else if(project.get('project_lang') == 'nl'){
          cardStyle = 'border-primary'
        } else if(project.get('project_lang') == 'fr'){
          cardStyle = 'border-secondary'
        } 

        projectList.push({
          'style': cardStyle,
          'language': project.get('project_lang'),
          'startTime': new Intl.DateTimeFormat('nl-BE', { dateStyle: 'medium', timeStyle: 'short' }).format(project.ProjectTable.get('startTime')),
          'endTime': new Intl.DateTimeFormat('nl-BE', { dateStyle: 'medium', timeStyle: 'short' }).format(project.ProjectTable.get('endTime')),
          'projectName': project.get('project_name'),
          'projectID': project.get('id'),
          'participants': participantsList.map((ele) => { return ele.get('firstname') + ' ' + ele.get('lastname') } ).join(', '),
          'link': (await attachments.pop()?.getHyperlink())?.get('href'),
          'description': project.get('project_descr'),
          'agreedToPhoto': agreedToPhoto, 
        })   
      }

      result[j+1][i] = {
        name: table.get('name'),
        projects: projectList
      }
    }
  }
  console.log(result)   

  res.render('calendar.handlebars', { grid: result })
}); 

module.exports = router;  
