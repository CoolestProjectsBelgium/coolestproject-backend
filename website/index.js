const express = require('express');
var cors = require('cors')
const models = require('../models');
const Project = models.Project;
const PublicVote = models.publicvote;
const Table = models.Table;
const Event = models.Event;
const Sequelize = require('sequelize');
const bodyParser = require('body-parser');

const DBA = require('../dba');
const database = new DBA();

var router = express.Router();
router.use(bodyParser.urlencoded({ extended: false })); // for SMS

const corsOptions = {
  origin: '*',
  methods: [],
  allowedHeaders: [],
  exposedHeaders: [],
  credentials: true
};

var handlebars = require('handlebars');
const publicvote = require('../models/publicvote');
handlebars.registerHelper("setVar", function(varName, varValue, options) {
  options.data.root[varName] = varValue;
});


router.get('/planning/:eventId/projects.xml', cors(corsOptions), async function (req, res) {
  const { create } = require('xmlbuilder');
  var root = create('projects.xml');
  var projects = await Project.findAll({ where: { eventId: req.params.eventId }});
  
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


router.get('/planning/:eventId/projects.json', cors(corsOptions), async function (req, res) {
  var projects = await Project.findAll({ where: {eventId: req.params.eventId }});
  var response = []

 for(let project of projects){
    let owner = await project.getOwner()
    let participants = await project.getParticipant()
    let attachments = await project.getAttachments({where:{confirmed:true}})
    let table = await project.getTables()
    let tableEquip = table[0]?.requirements
    if (!tableEquip ) {tableEquip = ""}
    response.push({
      'projectName': project.get('project_name'),
      'Language': project.get('project_lang'),
      'projectID': project.get('id'),
      'participants': [owner].concat(participants).map((ele) => { return ele.get('firstname') + ' ' + ele.get('lastname') } ).join(', '),
      'link': (await attachments[0]?.getHyperlink())?.get('href'),
      'location': table[0]?.LocationId,
      'place': table[0]?.name,
      'usedPlaces': table[0]?.ProjectTable.get('usedPlaces'),
      'techrequire': project.get('project_type'),
      'tableEquip': tableEquip,
      'description': project.get('project_descr')
    })
  }
  res.json(response);
});

router.get('/planning/:eventId/', cors(corsOptions), async function (req, res, next) {
  // create a planning table structure 
  // x -> list of locations
  // y -> list of table
  // z -> list of projects

  const event = await Event.findByPk(req.params.eventId)
  if (event === null) {
    return next(new Error('event not found'))
  }
   // Save eventId from user input
  //eventId = event.id;
  const locations = await event.getLocations() 
  const tablesGroupedCount = await Table.findAll(
    {
      attributes: ['LocationId','EventId', [Sequelize.fn('count', Sequelize.col('LocationId')), 'count']],
      group: ['LocationId','EventId'],
      having : { 'EventId': event.get('id') }
    }
  )
  // we need header values in the first row so + 1 for length
  const maxTablesCount = Math.max(...tablesGroupedCount.map(o => o.get('count')), 0) + 1;

  const result = Array(maxTablesCount).fill().map(() => Array(locations.length));
  for (const [i, location] of locations.entries()) {
    result[0][i] = {
      name: location.get('text'),
      header: true 
    }
    

    let tables = await location.getTables()
    for (const [j, table] of tables.entries()) {
      let projectList = []
      let projects = await table.getProjects()
      let Needs = true
      let tableEquip = "";
      if (tables[j]?.requirements !== null){tableEquip = JSON.stringify(tables[j]?.requirements);Needs=true}

     //console.log("tableEquip:",tableEquip)
     //console.log("Needs:",Needs)


      for(let project of projects){
        let participantsList = []
        let owner = await project.getOwner()
        let agreedToPhoto = true
        if(owner){
          participantsList.push(owner)
          agreedToPhoto = agreedToPhoto && (await owner.getQuestions()).some((ele) => { return ele.name == 'Agreed to Photo' })
        }
        let participants = await project.getParticipant()
        if(participants){
          for(let participant of participants){
            agreedToPhoto = agreedToPhoto && (await participant.getQuestions()).some((ele) => { return ele.name == 'Agreed to Photo' })
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
        let endTime = new Intl.DateTimeFormat('nl-BE', {  timeStyle: 'short' }).format(project.ProjectTable.get('endTime'));
        let startTime = new Intl.DateTimeFormat('nl-BE', { dateStyle: 'medium', timeStyle: 'short' }).format(project.ProjectTable.get('startTime'));
        let testTime = new Intl.DateTimeFormat('nl-BE', {  timeStyle: 'short' }).format(project.ProjectTable.get('startTime'));   
        let yesdescript = true;
       // let Needs = false;

        if (endTime == '00:00'){ endTime = 0; yesdescript = false; Needs = true};
        if (testTime == '00:00'){ endTime = 0; yesdescript = false; Needs = true};
        let requirements = project.get('project_type');
    

        projectList.push({
          'style': cardStyle,
          'language': project.get('project_lang'),
          'startTime': startTime,
          'endTime': endTime,
          'projectName': project.get('project_name'),
          'projectID': project.get('id'),
          'participants': participantsList.map((ele) => { return ele.get('firstname') + ' ' + ele.get('lastname') } ).join(', '),
          'link': (await attachments.pop()?.getHyperlink())?.get('href'),
          'description': project.get('project_descr'),
          'agreedToPhoto': agreedToPhoto, 
          'startTimeShort': new Intl.DateTimeFormat('nl-BE', {  timeStyle: 'short' }).format(project.ProjectTable.get('startTime')),
          'techrequire': requirements,
          'Needs': Needs,
          'tableEquip': tableEquip,
          'yesdescript': yesdescript
        }) 
        //console.log(projectList)  ;

        const url = req.originalUrl  ;
        const last = url.charAt(url.length - 1);
        if (last !='/'){eventId = last}
        console.log(req.originalUrl)  ;
        console.log(last)  ;
      }

      result[j+1][i] = {
        name: table.get('name'),
        projects: projectList
      }
    }
  }
 //console.log(result)


  res.render('calendar.handlebars', { 
    eventName: event.event_title, 
    eventDate: new Intl.DateTimeFormat('nl-BE', {  dateStyle: 'short' }).format(event.officialStartDate), 
    grid: result 
    })
});

router.get('/presentation/:eventId/', cors(corsOptions), async function (req, res, next) {
  // create a planning table structure 
  // x -> list of locations
  // y -> list of table
  // z -> list of projects

  //console.log("=====parameter input:...planning/2/?Project=##")
  //console.log(req.query)
  

  const event = await Event.findByPk(req.params.eventId)
  if (event === null) {
    return next(new Error('event not found'))
  }
  const locations = await event.getLocations() 
  const tablesGroupedCount = await Table.findAll(
    {
      attributes: ['LocationId','EventId', [Sequelize.fn('count', Sequelize.col('LocationId')), 'count']],
      group: ['LocationId','EventId'],
      having : { 'EventId': event.get('id') }
    }
  )

  // we need header values in the first row so + 1 for length
  const maxTablesCount = Math.max(...tablesGroupedCount.map(o => o.get('count')), 0)  + 1;

  const result = Array(maxTablesCount).fill().map(() => Array(locations.length));
  for (const [i, location] of locations.entries()) {
    result[0][i] = {
      name: location.get('text'),
      header: true 
    }

    let tables = await location.getTables()

    for (const [j, table] of tables.entries()) {
      let projectList = []
      let projects = await table.getProjects()
      let tableEquip = "";

      if(projects!=[]){
          for(let project of projects){

            if(!req.query.ProjectId || project.get('id') == req.query.ProjectId){
              let participantsList = []
              let owner = await project.getOwner()
              let agreedToPhoto = true

              if(owner){
                participantsList.push(owner)
                agreedToPhoto = agreedToPhoto && (await owner.getQuestions()).some((ele) => { return ele.name == 'Agreed to Photo' })
              }
              let participants = await project.getParticipant()
          
              if(participants){
                for(let participant of participants){
                  agreedToPhoto = agreedToPhoto && (await participant.getQuestions()).some((ele) => { return ele.name == 'Agreed to Photo' })
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
                'name': table.name,
                'projectName': project.get('project_name'),
                'projectID': project.get('id'),
                'participants': participantsList.map((ele) => { return ele.get('firstname') + ' ' + ele.get('lastname') } ).join(', '),
                'link': (await attachments.pop()?.getHyperlink())?.get('href'),
                'description': project.get('project_descr'),
                'messages': '😎<====Running text footer for important messages 🎯 =====<<===Running text 😅<',
                // https://getemoji.com/     https://www.tutorialspoint.com/html/html_marquees.htm
                'agreedToPhoto': agreedToPhoto
              }) 
              console.log("====>projectList")  
              console.log(projectList)   

              result[j+1][i] = {
                name: table.get('name'),
                projects: projectList
                }
            }
          }
        }
     }
  }

  console.log(result)  

  res.render('presentation.handlebars', { 
    eventName: event.event_title, 
    eventDate: new Intl.DateTimeFormat('nl-BE', {  dateStyle: 'short' }).format(event.officialStartDate), 
    grid: result 
    })
});

/**
 * Called by the Twilio webhook whenever a SMS comes in
 */
router.post('/sms', async function (req, res, next) {

  console.log(req.body);
  
  const projectId = parseInt(req.body.Body);
  const project = await database.getProjectById(projectId);
  const phone = req.body.From || null;

  const pv = await PublicVote.create( {projectId: project.id, phone } );

  res.status(200).send(null);
});

router.get('/video-presentation/:eventId/', cors(corsOptions), async function (req, res, next) {
 var projects = await Project.findAll({ where: {eventId: req.params.eventId }});
 let projectList = []
 let pCount = 0

 // create a planning table structure 
 // x -> list of locations
 // y -> list of table
 // z -> list of projects

 const event = await Event.findByPk(req.params.eventId)
 if (event === null) {
   return next(new Error('event not found'))
 }

 const locations = await event.getLocations() 
 const tablesGroupedCount = await Table.findAll(
   {
   attributes: ['LocationId','EventId', [Sequelize.fn('count', Sequelize.col('LocationId')), 'count']],
   group: ['LocationId','EventId'],
   having : { 'EventId': event.get('id') }
   }
 )
 // we need header values in the first row so + 1 for length
 let maxTablesCount = Math.max(...tablesGroupedCount.map(o => o.get('count')), 0) + 1
 maxTablesCount = 1
 const result = Array(maxTablesCount).fill().map(() => Array(locations.length));
 console.log("maxTablesCount:", maxTablesCount)
 pCount = 1
 for(let project of projects){

   if(project.get('id') == req.query.ProjectId){

     let participantsList = []
     let attachments = await project.getAttachments({where:{confirmed:true}})
     let table = await project.getTables()
     let agreedToPhoto = true

     let owner = await project.getOwner()
     if(owner){
       participantsList.push(owner)
       agreedToPhoto = agreedToPhoto && (await owner.getQuestions()).some((ele) => { return ele.name == 'Agreed to Photo' })
     }
     let participants = await project.getParticipant()  
     if(participants){
         for(let participant of participants){
           agreedToPhotopCount = agreedToPhoto && (await participant.getQuestions()).some((ele) => { return ele.name == 'Agreed to Photo' })
         }
         participantsList.push(...participants) 
     } 

       let cardStyle = ''
       if(!agreedToPhoto){
           cardStyle = 'border-danger'
         } else if(project.get('project_lang') == 'nl'){
           cardStyle = 'border-primary'
         } else if(project.get('project_lang') == 'fr'){
                   cardStyle = 'border-secondary'
         } 
       let hlink2 =""
       let hcode = (await attachments.pop()?.getHyperlink())?.get('href')
       //console.log("Youtube code:",hcode)
       if (hcode){let res = hcode.split("/")
         hlink2 = 'https://youtube.be/embed/' + res[3]+ '?autoplay=1'
       } else {hlink2 = "no video found"}
       tName = table[0]?.name
       if(!tName){tName ="not yet assigned"}
      
       projectList.push({
         'style': cardStyle,
         'language': project.get('project_lang'),
         'projectName': project.get('project_name'),
         'projectID': project.get('id'),
         'participants': [owner].concat(participants).map((ele) => { return ele.get('firstname') + ' ' + ele.get('lastname') } ).join(', '),
         'link': hcode,
         'link2': hlink2,
         'description': project.get('project_descr'),
         'agreedToPhoto': agreedToPhoto, 
         'location': table[0]?.LocationId,
         'name': tName,
         'messages': '😎<====Running text footer for important messages 🎯 =====<<===Running text 😅<'
         // === https://getemoji.com/     https://www.tutorialspoint.com/html/html_marquees.htm ===
       })
      
       console.log(projectList)  
       result[0][0] = {
         name: table[0]?.name,
         projects: projectList,
       }
        res.render('video-presentation.handlebars', { 
          grid: result
          })
  }
    
}

  return
}); 


module.exports = router; 
