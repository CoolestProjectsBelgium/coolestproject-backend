'use strict';

const cls = require('cls-hooked');
const namespace = cls.createNamespace('coolestproject');
const { v4: uuidv4 } = require('uuid');

const addYears = require('date-fns/addYears');
const endOfMonth = require('date-fns/endOfMonth');
const startOfMonth = require('date-fns/startOfMonth');

const FunctionalError = require('../utils/FunctionalError');

const crypto = require('crypto');
const { Op } = require('sequelize');

const models = require('../models');

const Sequelize = require('sequelize');
Sequelize.useCLS(namespace);

const bcrypt = require('bcrypt');
const { logger } = require('handlebars');

const Account = models.Account;
const QuestionRegistration = models.QuestionRegistration;
const QuestionUser = models.QuestionUser;
const Project = models.Project;
const Question = models.Question;
const User = models.User;
const Voucher = models.Voucher;
const Event = models.Event;
const TShirt = models.TShirt;
const TShirtGroup = models.TShirtGroup;
const Registration = models.Registration;
const sequelize = models.sequelize;
const QuestionTranslation = models.QuestionTranslation;
const TShirtTranslation = models.TShirtTranslation;
const TShirtGroupTranslation = models.TShirtGroupTranslation;
const Attachment = models.Attachment;
const AzureBlob = models.AzureBlob;

class DBA {
  constructor(azure) {
    this.azure = azure;
  }

  /**
     * @param {Integer} registrationId 
     * @returns {Promise<models.User>} created User
     */
  async createUserFromRegistration(registrationId) {
    return await sequelize.transaction(
      async () => {
        const registration = await this.getRegistration(registrationId);
        if (registration === null) {
          throw new Error(`No registration found for id ${registrationId}`);
        }
        let userId = null;
        if (registration.project_code) {
          // create user and add to existing project
          const participant = await this.createUserWithVoucher(
            {
              language: registration.language,
              postalcode: registration.postalcode,
              email: registration.email,
              gsm: registration.gsm,
              firstname: registration.firstname,
              lastname: registration.lastname,
              sex: registration.sex,
              birthmonth: registration.birthmonth,
              sizeId: registration.sizeId,
              via: registration.via,
              medical: registration.medical,
              gsm_guardian: registration.gsm_guardian,
              email_guardian: registration.email_guardian,
              eventId: registration.eventId,
              street: registration.street,
              municipality_name: registration.municipality_name,
              house_number: registration.house_number,
              box_number: registration.box_number,
              questions_user: registration.questions.map(q => { return { QuestionId: q.QuestionId }; }),
            },
            registration.project_code,
            registration.id
          );
          userId = participant.id;
        } else {
          // create user with project
          const owner = await this.createUserWithProject(
            {
              language: registration.language,
              postalcode: registration.postalcode,
              email: registration.email,
              gsm: registration.gsm,
              firstname: registration.firstname,
              lastname: registration.lastname,
              sex: registration.sex,
              birthmonth: registration.birthmonth,
              sizeId: registration.sizeId,
              via: registration.via,
              medical: registration.medical,
              gsm_guardian: registration.gsm_guardian,
              email_guardian: registration.email_guardian,
              general_questions: registration.general_questions,
              eventId: registration.eventId,
              municipality_name: registration.municipality_name,
              street: registration.street,
              house_number: registration.house_number,
              box_number: registration.box_number,
              questions_user: registration.questions.map(q => { return { QuestionId: q.QuestionId }; }),
              project: {
                eventId: registration.eventId,
                project_name: registration.project_name,
                project_descr: registration.project_descr,
                project_type: registration.project_type,
                project_lang: registration.project_lang,
                max_tokens: registration.max_tokens,
              }
            },
            registration.id
          );
          userId = owner.id;
        }
        // return the newly created user
        return await this.getUser(userId);
      }
    );
  }

  /**
     * @param {string} password - unencrypted password
     * @returns {string}
     */
  static generatePwd(password) {
    const salt = bcrypt.genSaltSync();
    const hash = bcrypt.hashSync(password, salt);
    return hash;
  }

  /**
    * Create a new user with a project
    * @param {Object} userProject - UserProject object
    * @returns {Promise<models.User>}
    * @example     
        {
            postalcode: 1000,
            email: "test@test.be",
            gsm: "003237722452",
            firstname: 'John',
            lastname: 'Doe',
            sex: 'm',
            birthmonth: new Date(2003, 01, 01),
            mandatory_approvals: 'aa',
            t_size: 'female_large',
            project: {
                project_name: 'test',
                project_descr: 'aaa',
                project_type: 'aa'
            }
        }
    */
  async createUserWithProject(userProject, registrationId) {
    const user = await User.create(userProject, {
      include: ['project', { model: QuestionUser, as: 'questions_user' }]
    });
    await Registration.destroy({ where: { id: registrationId } });
    return user;
  }

  /**
     * Create a new user with a token
     * @param {Object} user - User object 
     * @param {Number} voucherId - voucher id
     * @returns {Promise<models.User>}
     * @example
        {
            postalcode: 1000,
            email: "test@test.be",
            gsm: "003237722452",
            firstname: 'John',
            lastname: 'Doe',
            sex: 'm',                
            birthmonth: new Date(2003, 01, 01),
            mandatory_approvals: 'aa',
            t_size: 'female_large'
        }
     */
  async createUserWithVoucher(user_data, voucherId, registrationId) {
    const user = await User.create(user_data, {
      include: [{ model: QuestionUser, as: 'questions_user' }]
    });

    // ignore when not found
    const voucher = await Voucher.findOne({ where: { id: voucherId, participantId: null }, lock: true });
    if (voucher !== null) {
      await voucher.setParticipant(user);
    }

    await Registration.destroy({ where: { id: registrationId } });

    return user;
  }

  /**
     * Update user information
     * @param {User} user
     * @param {Number} userId
     * @returns {Promise<Boolean>} updated successfully
     */
  async updateUser(changedFields, userId) {
    return await sequelize.transaction(async () => {
      // remove fields that are not allowed to change (be paranoid)
      delete changedFields.email;

      //flatten address
      const address = changedFields.address;
      if(address){
        changedFields.postalcode = address.postalcode;
        changedFields.street = address.street;
        changedFields.house_number = address.house_number;
        changedFields.box_number = address.box_number;
        changedFields.municipality_name = address.municipality_name;
      }
      delete changedFields.address;

      // cleanup guardian fields when not needed anymore
      let user = await User.findByPk(userId, { include: [{ model: Question, as: 'questions' }] });
      const event = await user.getEvent();

      let questions = changedFields.mandatory_approvals.concat(changedFields.general_questions);
      await user.setQuestions(questions);

      changedFields.questions = questions.map((q) => { return { QuestionId: q };});

      // map questions
      delete changedFields.mandatory_approvals;
      delete changedFields.general_questions;

      // create date
      const birthmonth = new Date(changedFields.year, changedFields.month, 1);
      delete changedFields.year;
      delete changedFields.month;
      changedFields.birthmonth = birthmonth;

      const minGuardian = addYears(event.startDate, -1 * event.minGuardianAge);
      if (minGuardian > birthmonth) {
        changedFields.gsm_guardian = null;
        changedFields.email_guardian = null;
      }
      changedFields.sizeId = changedFields.t_size;

      this.validateUser(changedFields, event);

      return await user.update(changedFields);
    });
  }

  /**
     * Delete a user
     * @param {Number} userId
     * @returns {Promise<Boolean>} Delete ok ?
     */
  async deleteUser(userId) {
    const project = await Project.findOne({ where: { ownerId: userId }, attributes: ['id'] });
    if (project) {
      throw new Error('Project found');
    }

    // check if we have a participation
    const project_voucher = await Voucher.findOne({ where: { participantId: userId }, attributes: ['id'] });
    if (project_voucher) {
      throw new Error('Project participation found');
    }

    const result = await User.destroy({ where: { id: userId } });
    return result;
  }

  /**
     * create a project and assign to existing user
     * @param {Object} project
     * @returns {Promise<models.Project>} created account
     */
  async createProject(project, userId) {
    const user = await User.findByPk(userId);
    const event = await user.getEvent();
    if(event.projectClosed){
      throw new Error('Project update is not allowed');
    }

    project.ownerId = userId;
    project.max_tokens = event.maxVoucher;

    this.validateProject(project, event);

    return await Project.create(project);
  }

  /**
     * Create a Account (user for admin panel & jury)
     * @param {Object} account
     * @returns {Promise<Account>} account
     */
  async createAccount(account) {
    return await Account.create(account);
  }

  /**
     * Update a project
     * @param {Project} project 
     * @param {Number} userId
     * @returns {Promise<Boolean>} Delete ok ?
     */
  async updateProject(changedFields, userId) {
    const project = await Project.findOne({ where: { ownerId: userId } });

    const user = await User.findByPk(userId);
    const event = await user.getEvent();

    if(event.projectClosed){
      throw new Error('Project update is not allowed');
    }

    this.validateProject(changedFields, event);

    return project.update(changedFields);
  }

  /**
     * @param {Number} userId
     * @returns {Promise<Boolean>} Is user allowed to be deleted ?
     */
  async isUserDeletable(userId) {
    return await sequelize.transaction(
      async () => {
        const project = await Project.findOne({ where: { ownerId: userId }, attributes: ['id'], lock: true });
        if (project !== null) {
          return false;
        }
        return true;
      }
    );
  }

  /**
     * Delete a project
     * @param {Number} userId 
     * @returns {Promise<Boolean>} delete ok 
     */
  async deleteProject(userId) {
    // delete project or voucher
    // only possible when there are no used vouchers
    return await sequelize.transaction(
      async () => {
        const project = await Project.findOne({ where: { ownerId: userId }, attributes: ['id'], lock: true });
        if (project !== null) {
          const usedVoucher = await Voucher.count({ where: { projectId: project.id, participantId: { [Op.ne]: null } }, lock: true });
          if (usedVoucher > 0) {
            throw new Error('Delete not possible tokens in use');
          }
          // delete files on azure
          for (const a of await project.getAttachments()) {
            const blob = await a.getAzureBlob();
            await this.azure.deleteBlob(blob.blob_name, blob.container_name);
          }
          return await Project.destroy({ where: { ownerId: userId } });
        } else {
          // delete voucher
          return await Voucher.destroy({ where: { participantId: userId } });
        }
      }
    );
  }

  /**
     * Create a voucher for a project
     * @param {Number} projectId 
     * @returns {Promise<models.Voucher>} created voucher
     */
  async createVoucher(userId) {
    return await sequelize.transaction(
      async () => {
        const project = await Project.findOne({ where: { ownerId: userId }, attributes: ['id', 'eventId', 'max_tokens'], lock: true });
        if (project === null) {
          throw new Error('No project found');
        }

        var totalVouchers = await Voucher.count({ where: { projectId: project.id }, lock: true });
        if (totalVouchers >= project.max_tokens) {
          throw new Error('Max token reached');
        }

        var token = await new Promise(function (resolve, reject) {
          crypto.randomBytes(18, function (error, buffer) {
            if (error) {
              reject(error);
            }
            resolve(buffer.toString('hex'));
          });
        });
        return await Voucher.create({ projectId: project.id, id: token, eventId: project.eventId });
      }
    );
  }

  /**
     * Create a attachment for a project
     * @param {Number} userId 
     */
  async getAttachmentSAS(name, userId) {
    const project = await Project.findOne({ where: { ownerId: userId }, attributes: ['id'] });
    if (project === null) {
      throw new Error('No project found');
    }
    const azureInfo = await AzureBlob.findOne({
      where: {
        '$Attachment.ProjectId$': project.id,
        blob_name: name
      },
      include: [
        { model: Attachment }
      ]
    });
    if (azureInfo === null) {
      throw new Error('No attachment found');
    }
    //blobName, type = 'w', filename=null, containerName=process.env.AZURE_STORAGE_CONTAINER
    return await this.azure.generateSAS(name,'w', null, azureInfo.container_name);
  }

  /**
     * Create a attachment for a project
     * @param {Number} userId 
     */
  async createAttachment(attachment_fields, userId) {
    return await sequelize.transaction(
      async () => {
        // check if we have a project owner
        const project = await Project.findOne({ where: { ownerId: userId } });
        if (project === null) {
          throw new Error('No project found');
        }

        // do some simple "validations"
        // this just checks if the provided files size is bigger than the allowed one 
        // this is user input, you need to validate this later on (TODO look into azure blob hooks)
        const event = await project.getEvent();
        if (event === null) {
          throw new Error('No Event Found');
        }

        if (attachment_fields.size > event.maxFileSize) {
          throw new Error('File validation failed');
        }

        const blobName = uuidv4();
        const containerName = event.azure_storage_container;

        // create AzureBlob & create Attachment
        const attachment = await AzureBlob.create({
          container_name: containerName,
          blob_name: blobName,
          size: attachment_fields.size,
          Attachment: {
            name: attachment_fields.name,
            filename: attachment_fields.filename,
            ProjectId: project.id,
            EventId: event.id,
            confirmed: false,
            internal: false
          }
        }, {
          include: [{ association: 'Attachment' }]
        });
        if (attachment === null) {
          throw new Error('Attachment failed');
        }
        //blobName, type = 'w', filename=null, containerName=process.env.AZURE_STORAGE_CONTAINER
        const sas = await this.azure.generateSAS(blobName,'w', null, containerName);

        return sas;
      }
    );
  }
  /**
     * Create a attachment for a project
     * @param {Number} attachmentId 
     */
  async deleteAttachment(userId, name) {
    return await sequelize.transaction(
      async () => {
        const project = await Project.findOne({ where: { ownerId: userId }, attributes: ['id'] });
        if (project === null) {
          throw new Error('No project found');
        }
        // get file linked to the project & not confirmed and not internal
        const azureInfo = await AzureBlob.findOne({
          where: {
            '$Attachment.ProjectId$': project.id,
            '$Attachment.confirmed$': false,
            '$Attachment.internal$': false,
            blob_name: name
          },
          include: [
            { model: Attachment }
          ]
        });
        if (azureInfo === null) {
          throw new Error('No attachment found');
        }
        await Attachment.destroy({ where: { id: azureInfo.Attachment.id } });

        await this.azure.deleteBlob(name, azureInfo.container_name);

        return null;
      }
    );
  }

  /**
     * Delete a participant from a project
     * @param {Number} projectId 
     * @param {Number} participantId
     * @returns {Promise<Boolean>} delete successfully
     */
  async deleteParticipantProject(projectId, participantId) {
    return await Voucher.destroy({ where: { projectId: projectId, participantId: participantId } });
  }

  /**
     * Add participant to a project
     * @param {Number} userId 
     * @param {Number} voucherId 
     * @returns {Promise<models.User>} created participant
     */
  async addParticipantProject(userId, voucherId) {
    const voucher = await Voucher.findOne({ where: { id: voucherId, participantId: null }, lock: true });
    if (voucher === null) {
      throw new FunctionalError('VOUCHER_NOT_FOUND');
    }
    await voucher.setParticipant(userId);
    return await voucher.getParticipant();
  }

  /** 
   * Validate & remove fields that are not needed
   * @param {Object} dbValues
   * @param {models.Event} event
  */
  async validateRegistration(dbValues, event) {
    await this.validateUser(dbValues, event);
    await this.validateProject(dbValues, event);
  }

  /**
   * Validate project fields
   * @param {*} dbValues 
   * @param {*} event 
   */
  async validateProject(dbValues, event) {
    // 4) check if own project or participant
    if (!dbValues.project_code) {
      if (!dbValues.project_name || !dbValues.project_descr || !dbValues.project_lang) {
        throw new Error('Project not filled in');
      }
    } else {
      if (dbValues.project_name || dbValues.project_descr || dbValues.project_lang || dbValues.project_type) {
        throw new Error('Project filled in');
      }
    }
  }

  /**
   * Validate the user fields
   * @param {Object} dbValues
   * @param {models.Event} event
   */
  async validateUser(dbValues, event) {
    // 1) check if the questions are valid
    const possibleQuestions = await event.getQuestions();

    // 1a) are all questions mapped to this event
    for (const q of dbValues.questions) {
      if (!possibleQuestions.some((value) => value.id === q.QuestionId)) {
        throw new Error('questions are not from the correct event');
      }
    }

    // 1b) are the mandatory approvals filled in
    for (const q of possibleQuestions.filter((value) => value.mandatory === true)) {
      if (!dbValues.questions.some((value) => value.QuestionId === q.id)) {
        throw new Error('mandatory questions not filled in');
      }
    }

    // validate data based on event settings
    const minAgeDate = addYears(endOfMonth(event.officialStartDate), -1 * event.minAge);
    const maxAgeDate = addYears(startOfMonth(event.officialStartDate), -1 * event.maxAge);
    console.log('ages:');
    console.log(event.officialStartDate);
    console.log(minAgeDate);
    console.log(maxAgeDate);
    // 2) check if birthdate is valid
    console.log(dbValues.birthmonth);
    if (!(dbValues.birthmonth <= minAgeDate && dbValues.birthmonth >= maxAgeDate)) {
      throw new Error('incorrect age');
    }

    // 3) check if guardian is required
    const minGuardian = addYears(startOfMonth(event.officialStartDate), -1 * event.minGuardianAge);
    console.log(minGuardian);
    if (minGuardian < dbValues.birthmonth) {
      if (!dbValues.gsm_guardian || !dbValues.email_guardian) {
        throw new Error('Guardian is required');
      }
    } else {
      // console.log(typeof dbValues.gsm_guardian);
      if (dbValues.gsm_guardian || dbValues.email_guardian) {
        throw new Error('Guardian is filled in');
      }
    }
  }

  /**
     * Add registration
     * @param {Object} registrationValues
     * @returns {Promise<models.Registration>} created registration
     */
  async createRegistration(registrationValues) {
    return await sequelize.transaction(
      async () => {
        // set the current event
        const event = await this.getEventActive();
        if (!event || !event.registrationOpen) {
          throw new FunctionalError('NO_ACTIVE_EVENT');
        }
        const dbValues = {};
        dbValues.eventId = event.id;
        dbValues.max_tokens = event.maxVoucher;

        //flatten user + guardian
        const user = registrationValues.user;
        dbValues.language = user.language;
        dbValues.email = user.email;
        dbValues.firstname = user.firstname;
        dbValues.lastname = user.lastname;
        dbValues.sex = user.sex;
        //dbValues.birthmonth = user.birthmonth;
        dbValues.via = user.via;
        dbValues.medical = user.medical;
        dbValues.gsm = user.gsm;
        dbValues.gsm_guardian = user.gsm_guardian;
        dbValues.email_guardian = user.email_guardian;
        dbValues.sizeId = user.t_size;
        dbValues.waiting_list = false;

        // to month (set hour to 12)
        dbValues.birthmonth = new Date(user.year, user.month, 12);

        // map the questions to the correct table
        const answers = [];
        if (user.general_questions) {
          answers.push(...user.general_questions.map(QuestionId => { return { QuestionId }; }));
        }
        if (user.mandatory_approvals) {
          answers.push(...user.mandatory_approvals.map(QuestionId => { return { QuestionId }; }));
        }
        dbValues.questions = answers;

        //flatten address
        const address = user.address;
        if (address) {
          dbValues.postalcode = address.postalcode;
          dbValues.street = address.street;
          dbValues.house_number = address.house_number;
          dbValues.box_number = address.box_number;
          dbValues.municipality_name = address.municipality_name;
        }

        //flatten own project
        const ownProject = registrationValues.project.own_project;
        if (ownProject) {
          dbValues.project_name = ownProject.project_name;
          dbValues.project_descr = ownProject.project_descr;
          dbValues.project_type = ownProject.project_type;
          dbValues.project_lang = ownProject.project_lang;
        }

        //flatten other project
        const otherProject = registrationValues.project.other_project;
        if (otherProject) {
          dbValues.project_code = otherProject.project_code;
        }

        await this.validateRegistration(dbValues, event);

        // check for waiting list
        const registration_count = await User.count({ where: { eventId: event.id }, lock: true }) + await Registration.count({ where: { eventId: event.id }, lock: true });
        if (registration_count >= event.maxRegistration) {
          dbValues.waiting_list = true;
          console.log('add to waiting list');
        }
        return await Registration.create(dbValues, { include: [{ model: QuestionRegistration, as: 'questions' }] });
      }
    );
  }

  /**
     * Get registration
     * @param {Registration} registration
     * @returns {Promise<models.egistration>}
     */
  async getRegistration(registrationId) {
    return await Registration.findByPk(registrationId, {
      lock: true,
      include: [{ model: QuestionRegistration, as: 'questions' },
        { model: Event, as: 'event' }]
    });
  }

  /**
     * Add registration
     * @param {Registration} registration
     * @returns {Promise<models.Registration>}
     */
  async getUser(userId) {
    return User.findByPk(userId);
  }

  /**
     * Add registration
     * @param {Registration} registration
     * @returns {Promise<models.Voucher>} list of vouchers for project
     */
  async getVouchers(userId) {
    var project = await Project.findOne({ where: { ownerId: userId }, attributes: ['id'] });
    let vouchers = [];
    if (project !== null) {
      vouchers = await Voucher.findAll({
        where: { projectId: project.id }, attributes: ['id'], include: [{
          model: User,
          as: 'participant',
          attributes: ['firstname', 'lastname']
        }]
      });
    }
    return vouchers;
  }

  /**
     * get Project
     * @param {Registration} registration
     * @returns {Promise<models.Registration>} project information
     */
  async getProject(userId) {
    // first look for own project
    var project = await Project.findOne({
      where: { ownerId: userId }, include: [
        {
          model: Voucher,
          include: [
            { model: User, as: 'participant', attributes: ['firstname', 'lastname', 'id'] }
          ]
        },
        { model: User, as: 'owner', attributes: ['firstname', 'lastname'] }
      ]
    });
    // check other project via voucher
    if (project === null) {
      const voucher = await Voucher.findOne({ where: { participantId: userId }, attributes: ['projectId'] });
      if (voucher === null) {
        return; //nothing exists on DB -> frontend redirects to no project page
      }
      project = await Project.findByPk(voucher.projectId, {
        include: [
          {
            model: Voucher,
            include: [
              { model: User, as: 'participant', attributes: ['firstname', 'lastname', 'id'] }
            ]
          },
          { model: User, as: 'owner', attributes: ['firstname', 'lastname'] }
        ]
      });
    }
    return project;
  }

  /**
   * Get the project based on its id
   * @param {Integer} projectId
   * @returns {Promise<models.Project>}
   */
  async getProjectById(projectId)
  {
    const event = await this.getEventActive();
    if (!event) {
      return;
    }
    console.log(event.id);

    const project = await Project.findOne({
      where: { Id: projectId, eventId : event.id }
    });
    //console.log(project);

    return project;
  }

  /**
     * Check if email address exists in User records table
     * @param {String} emailAddress
     * @param {models.Event} event
     * @returns {Promise<Boolean>} 
     */
  async doesEmailExists(emailAddress, event) {
    const count = await User.count({ where: { email: emailAddress, eventId: event.id } });
    return count !== 0;
  }
  /**
     * Get user via email
     * @param {String} email
     * @returns {Promise<models.User>}
     */
  async getUsersViaMail(email) {
    return await User.findAll({
      where: {
        [Op.or]: [
          {
            email: email
          },
          {
            email_guardian: email
          }
        ]
      }
    });
  }
  /**
     * Get only user via email
     * @param {String} email
     * @returns {Promise<models.User>}
     */
  async getOnlyUsersViaMail(email, event) {
    return await User.findAll({
      where: {
        email: email,
        eventId: event.id
      }
    });
  }

  /**
     * Update token
     * @param {Number} userId
     * @returns {Promise<models.User>}
     */
  async updateLastToken(userId) {
    const user = await User.findByPk(userId);
    user.last_token = new Date();
    await user.save();
  }

  /**
     * Set the event active
     * @param {Number} eventId
     * @returns {Promise<models.Event>}
     */
  async setEventActive(eventId) {
    return sequelize.transaction(
      async () => {
        // cancel previous events
        await Event.update({ eventEndDate: new Date() }, { where: { id: { [Op.ne]: eventId } } });

        //activate current
        const event = await Event.findByPk(eventId);
        if (event === null) {
          throw new Error('No event found');
        }
        event.eventStartDate = new Date();

        if(event.eventEndDate <= new Date()){
          event.eventEndDate = addYears(new Date(), 1);
        }

        return event.save();
      }
    );
  }

  /**
     * get event by id
     * @param {Number} eventId
     * @returns {Promise<models.Event>}
     */
  async getEvent(eventId) {
    return await Event.findByPk(eventId);
  }

  /**
     * get active event
     * @returns {Promise<models.Event>}
     */
  async getEventActive() {
    const activeEvent = await Event.findOne({
      where: {
        eventBeginDate: {
          [Op.lt]: Sequelize.literal('CURDATE()'),
        },
        eventEndDate: {
          [Op.gt]: Sequelize.literal('CURDATE()'),
        }
      },
      attributes: ['id']
    });

    if (!activeEvent) {
      throw new Error('No Event Active');
    }

    return this.getEventDetail(activeEvent.id);
  }

  /**
     * get active event
     * @returns {Promise<Event>}
     */
  async getEventDetail(eventId, language = 'en') {
    const event = await Event.findByPk(eventId, {
      attributes: {
        include: [
          [sequelize.literal('(SELECT count(*) from Vouchers where Vouchers.eventID = Event.id and Vouchers.participantId IS NULL)'), 'total_unusedVouchers'],
          [sequelize.literal('(SELECT count(*) from Vouchers where Vouchers.eventID = Event.id and Vouchers.participantId > 0)'), 'total_usedVouchers'],
          [sequelize.literal('(SELECT count(*) from Registrations where Registrations.eventId = Event.id)'), 'pending_users'],
          [sequelize.literal('(SELECT count(*) from Registrations where Registrations.eventId = Event.id and waiting_list = 1)'), 'waiting_list'],
          [sequelize.literal('(SELECT count(DISTINCT Attachments.ProjectId ) from Attachments)'), 'total_videos'],
          [sequelize.literal('(SELECT count(*) from Users where Users.eventId = Event.id and Users.sex = \'m\')'), 'total_males'],
          [sequelize.literal('(SELECT count(*) from Users where Users.eventId = Event.id and Users.sex = \'f\')'), 'total_females'],
          [sequelize.literal('(SELECT count(*) from Users where Users.eventId = Event.id and Users.sex = \'x\')'), 'total_X'],
          [sequelize.literal('(SELECT count(*) from Users where Users.eventId = Event.id and Users.language = \'nl\')'), 'tlang_nl'],
          [sequelize.literal('(SELECT count(*) from Users where Users.eventId = Event.id and Users.language = \'fr\')'), 'tlang_fr'],
          [sequelize.literal('(SELECT count(*) from Users where Users.eventId = Event.id and Users.language = \'en\')'), 'tlang_en'],
          [sequelize.literal('(SELECT count(*) from Users where Users.eventId = Event.id)'), 'total_users'],
          [sequelize.literal('(SELECT count(DISTINCT Attachments.ProjectId ) from Attachments INNER JOIN Projects ON Projects.id = Attachments.ProjectId WHERE Projects.eventId = Event.id )'), 'total_videos'],
          [sequelize.literal('DATEDIFF(officialStartDate, CURDATE())'), 'days_remaining'],
          [sequelize.literal('(SELECT count(*) from Projects where Projects.eventId = Event.id)'), 'total_projects'],
          [sequelize.literal(`(SELECT count(*) from Registrations where Registrations.eventId = Event.id and DATE_ADD(Registrations.createdAt, INTERVAL ${process.env.TOKEN_VALID_TIME} SECOND) < CURDATE() )`), 'overdue_registration']
        ]
      }
    });
    // count the questions grouped by event & type
    event.questions = [];
    const questions = await QuestionUser.findAll({
      raw: true,
      attributes: [
        [sequelize.fn('COUNT', sequelize.col('UserId')), 'total'],
        [sequelize.col('QuestionUser.QuestionId'), 'id'],
        [sequelize.col('Question.name'), 'short'],
        [sequelize.col('Question.QuestionTranslations.description'), 'description'],
      ],
      group: 'QuestionUser.QuestionId',
      include: [
        { model: User, attributes: [], where: { 'EventId': eventId }, required: true },
        {
          model: Question, attributes: [], required: true,
          include: [
            {
              model: QuestionTranslation, attributes: [], where: { 'language': language }
            }]
        }
      ]
    });

    if (questions !== null) {
      event.questions = questions;
    }

    // count the t-shirts grouped by event & type
    event.tshirts = [];
    const tshirts = await User.findAll({
      raw: true,
      attributes: [
        [sequelize.fn('COUNT', sequelize.col('User.id')), 'total'],
        [sequelize.col('User.SizeId'), 'id'],
        [sequelize.col('size.name'), 'short'],
        [sequelize.col('size.TShirtTranslations.description'), 'description'],
      ],
      group: 'User.SizeId',
      where: { 'EventId': eventId },
      include: [
        {
          model: TShirt, attributes: [], required: true, as: 'size',
          include: [
            {
              model: TShirtTranslation, required: false, attributes: [], where: { 'language': language }
            }]
        }
      ]
    });

    if (tshirts !== null) {
      event.tshirts = tshirts;
    }

    return event;
  }

  async getTshirtsGroups(language, event) {
    return await TShirtGroup.findAll({
      attributes: ['id', 'name'],
      where: { 'EventId': event.id },
      include: [
        {
          model: TShirtGroupTranslation,
          where: { [Op.or]: [{ language: language }, { language: 'nl' }] },
          required: false,
          attributes: ['language', 'description']
        }
      ]
    });
  }

  /**
     * get active event
     * @returns {Promise<TShirt>}
     */
  async getTshirts(language, event) {
    return await TShirt.findAll({
      attributes: ['id', 'name'],
      include: [
        {
          model: TShirtGroup, as: 'group', attributes: ['id', 'name'], required: false,
          include: [
            { model: TShirtGroupTranslation, where: { [Op.or]: [{ language: language }, { language: 'nl' }] }, required: false, attributes: ['language', 'description'] }
          ]
        },
        {
          model: TShirtTranslation, where: { [Op.or]: [{ language: language }, { language: 'nl' }] }, required: false, attributes: ['language', 'description']
        },
      ],
      where: { eventId: event.id }
    });

  }

  /**
     * get questions
     * @returns {Promise<object>}
     */
  async getQuestions(language, event) {
    const optionalQuestions = await Question.findAll({
      attributes: ['id', 'name'], where: { eventId: event.id, mandatory: { [Op.not]: true } }
      , include: [{ model: QuestionTranslation, where: { [Op.or]: [{ language: language }, { language: process.env.LANG }] }, required: false, attributes: ['language', 'description', 'positive', 'negative'] }]
    });
    return optionalQuestions.map((q) => {
      // default to nl when no translation was found
      let languageIndex = q.QuestionTranslations.findIndex((x) => x.language === language);
      if (languageIndex == -1) {
        languageIndex = q.QuestionTranslations.findIndex((x) => x.language === process.env.LANG);
      }
      return {
        'id': q.id+ '',
        'name': q.name,
        'description': ((q.QuestionTranslations[languageIndex]) ? q.QuestionTranslations[languageIndex].description : q.name),
        'positive': ((q.QuestionTranslations[languageIndex]) ? q.QuestionTranslations[languageIndex].positive : `positive ${q.name}`),
        'negative': ((q.QuestionTranslations[languageIndex]) ? q.QuestionTranslations[languageIndex].negative : `negative ${q.name}`),
      };
    });
  }

  /**
     * get approvals
     * @returns {Promise<object>}
     */
  async getApprovals(language, event) {
    const mandatoryQuestions = await Question.findAll({
      attributes: ['id', 'name'], where: { eventId: event.id, mandatory: true }
      , include: [{ model: QuestionTranslation, where: { [Op.or]: [{ language: language }, { language: 'nl' }] }, required: false, attributes: ['language', 'description'] }]
    });
    return mandatoryQuestions.map((q) => {
      // default to nl when no translation was found
      let languageIndex = q.QuestionTranslations.findIndex(x => x.language === language);
      if (languageIndex == -1) {
        languageIndex = q.QuestionTranslations.findIndex(x => x.language === 'nl');
      }
      return {
        'id': q.id,
        'name': q.name,
        'description': ((q.QuestionTranslations[languageIndex]) ? q.QuestionTranslations[languageIndex].description : q.name)
      };
    });
  }

}

module.exports = DBA;