const express = require('express');
var cors = require('cors')
const models = require('../models');
const Project = models.Project;
const Location = models.Location;
const Attachment = models.Attachment;
const Hyperlink = models.Hyperlink;
const User = models.User;
const Table = models.Table;
const Event = models.Event;
const Sequelize = require('sequelize');

var router = express.Router(); 

const corsOptions = {
  origin: '*',
  methods: [],
  allowedHeaders: [],
  exposedHeaders: [],
  credentials: true
};

router.get('/votes', cors(corsOptions), async function (req, res) {
  res.send(xml); 
});

module.exports = router;  
