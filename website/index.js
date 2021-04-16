

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


router.get('/projects.xml', cors(), async function (req, res) {
  const { create } = require('xmlbuilder');
  var root = create('projects.xml');

  var projects = await Project.findAll(
    { where: {'$Attachments.confirmed$':true}, 
    order: [['id', 'asc']], 
    include:[
      { model: Attachment, required: false,  
          include: [ Hyperlink ] }, 
      { model: User, as: 'participant' }, 
      { model: User, as: 'owner' }
      ]
    }
  );
  
  for(let project of projects){
    let owner = await project.getOwner()
    let participants = await project.getParticipant()
    let attachments = await project.getAttachments({where:{confirmed:true}})

    root.root().ele('project', {
      'ProjectName': project.get('project_name'),
      'ProjectID': project.get('id'),
      'participants': [owner].concat(participants).map((ele) => { return ele.get('firstname') + ' ' + ele.get('lastname') } ).join(', '),
      'link': (await attachments[0]?.getHyperlink())?.get('href'),
      'Description': project.get('project_descr')
    });
  }
  const xml = root.end({ pretty: true});
  res.send(xml);
  
});

router.get('/projects.json', cors(), async function (req, res) {
  var projects = await Project.findAll(
    { where: {'$Attachments.confirmed$':true}, 
    order: [[Attachment,'createdAt', 'asc']], 
    include:[
      { model: Table }, 
      { model: Attachment, required: false,  
        include: [ Hyperlink ] }, 
      { model: User, as: 'participant' }, 
      { model: User, as: 'owner' }
      ]
    }
    );
  
  var response = []  
  for(let project of projects){
    let owner = await project.getOwner()
    let participants = await project.getParticipant()
    let attachments = await project.getAttachments({where:{confirmed:true}})
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

router.get('/planning', cors(), async function (req, res) {
  // create a planning table structure 
  // x -> list of locations
  // y -> list of table
  // z -> list of projects
  const locations = await Location.findAll({ include:[{ model: Table, include:[{ model: Project }] }] })
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
        if(owner){
          participantsList.push(owner)
        }
        let participants = await project.getParticipant()
        if(participants){
          participantsList.push(...participants)
        } 

        let attachments = await project.getAttachments()
    
        projectList.push({
          'projectName': project.get('project_name'),
          'projectID': project.get('id'),
          'participants': participantsList.map((ele) => { return ele.get('firstname') + ' ' + ele.get('lastname') } ).join(', '),
          'link': (await attachments.pop()?.getHyperlink())?.get('href'),
          'description': project.get('project_descr')
        })   
      }

      result[j+1][i] = {
        name: table.get('name'),
        projects: projectList
      }
    };
  }
  console.log(result)   

  res.render('calendar.handlebars', { grid: result })
}); 

module.exports = router;  
