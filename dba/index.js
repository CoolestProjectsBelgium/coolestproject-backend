'use strict';

const cls = require('cls-hooked');
const namespace = cls.createNamespace('coolestproject');
const { v4: uuidv4 } = require('uuid');

const addYears = require('date-fns/addYears');

const crypto = require('crypto');

const Sequelize = require('sequelize');
Sequelize.useCLS(namespace);

const bcrypt = require('bcrypt');

class DBA {
  constructor(models, azure){
    this.Account = models.Account;
    this.QuestionRegistration = models.QuestionRegistration;
    this.QuestionUser = models.QuestionUser;
    this.Project = models.Project;
    this.Question = models.Question;
    this.User = models.User;
    this.Voucher = models.Voucher;
    this.Event = models.Event;
    this.TShirt = models.TShirt;
    this.TShirtGroup = models.TShirtGroup;
    this.Registration = models.Registration;
    this.sequelize = models.sequelize;
    this.Op = Sequelize.Op;
    this.QuestionTranslation = models.QuestionTranslation;
    this.TShirtTranslation = models.TShirtTranslation;
    this.TShirtGroupTranslation = models.TShirtGroupTranslation;
    this.Attachment = models.Attachment;
    this.AzureBlob = models.AzureBlob;

    this.azure = azure;
  }

  /**
     * @param {Integer} registrationId 
     * @returns {Promise<User>} created User
     */
  async createUserFromRegistration(registrationId) {
    return await this.sequelize.transaction(
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
  generatePwd(password) {
    const salt = bcrypt.genSaltSync();
    const hash = bcrypt.hashSync(password, salt);
    return hash;
  }

  /**
    * Create a new user with a project
    * @param {Object} userProject - UserProject object
    * @returns {Promise<User>}
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
    const user = await this.User.create(userProject, {
      include: ['project', { model: this.QuestionUser, as: 'questions_user' }]
    });
    await this.Registration.destroy({ where: { id: registrationId } });
    return user;
  }

  /**
     * Create a new user with a token
     * @param {Object} user - User object 
     * @param {Number} voucherId - voucher id
     * @returns {Promise<User>}
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
    const voucher = await this.Voucher.findOne({ where: { id: voucherId, participantId: null }, lock: true });
    if (voucher === null) {
      throw new Error(`Token ${voucherId} not found`);
    }
    const user = await this.User.create(user_data, {
      include: [{ model: this.QuestionUser, as: 'questions_user' }]
    });
    await voucher.setParticipant(user);
    await this.Registration.destroy({ where: { id: registrationId } });

    return user;
  }

  /**
     * Update user information
     * @param {User} user
     * @param {Number} userId
     * @returns {Promise<Boolean>} updated successfully
     */
  async updateUser(changedFields, userId) {
    return await this.sequelize.transaction(async () => {
      // remove fields that are not allowed to change (be paranoid)
      delete changedFields.email;

      //flatten address
      const address = changedFields.address;
      changedFields.postalcode = address.postalcode;
      changedFields.street = address.street;
      changedFields.house_number = address.house_number;
      changedFields.bus_number = address.bus_number;
      changedFields.municipality_name = address.municipality_name;
      delete changedFields.address;

      // cleanup guardian fields when not needed anymore
      const user = await this.User.findByPk(userId, { include: [{ model: this.Question, as: 'questions' }] });
      const event = await user.getEvent();

      await user.setQuestions(changedFields.mandatory_approvals.concat(changedFields.general_questions));

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

      return await user.update(changedFields);
    });
  }

  /**
     * Delete a user
     * @param {Number} userId
     * @returns {Promise<Boolean>} Delete ok ?
     */
  async deleteUser(userId) {
    const project = await this.Project.findOne({ where: { ownerId: userId }, attributes: ['id'] });
    if (project) {
      throw new Error('Project found');
    }
    const result = await this.User.destroy({ where: { id: userId } });
    return result; 
  }

  /**
     * create a project and assign to existing user
     * @param {Object} project
     * @returns {Promise<Project>} created account
     */
  async createProject(project, userId) {
    const user = await this.User.findByPk(userId);
    const event = await user.getEvent();
    project.ownerId = userId;
    project.max_tokens = event.maxVoucher;

    return await this.Project.create(project);
  }

  /**
     * Create a Account (user for admin panel & jury)
     * @param {Object} account
     * @returns {Promise<Account>} account
     */
  async createAccount(account) {
    return await this.Account.create(account);
  }

  /**
     * Update a project
     * @param {Project} project 
     * @param {Number} userId
     * @returns {Promise<Boolean>} Delete ok ?
     */
  async updateProject(changedFields, userId) {
    const project = await this.Project.findOne({ where: { ownerId: userId } });
    return project.update(changedFields);
  }

  /**
     * @param {Number} userId
     * @returns {Promise<Boolean>} Is user allowed to be deleted ?
     */
  async isUserDeletable(userId) {
    return await this.sequelize.transaction(
      async () => {
        const project = await this.Project.findOne({ where: { ownerId: userId }, attributes: ['id'], lock: true });
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
    return await this.sequelize.transaction(
      async () => {
        const project = await this.Project.findOne({ where: { ownerId: userId }, attributes: ['id'], lock: true });
        if (project !== null) {
          const usedVoucher = await this.Voucher.count({ where: { projectId: project.id, participantId: { [this.Op.ne]: null } }, lock: true });
          if (usedVoucher > 0) {
            throw new Error('Delete not possible tokens in use');
          }
          // delete files on azure
          for(const a of await project.getAttachments()){
            const blob = await a.getAzureBlob();
            await this.azure.deleteBlob(blob.blob_name);
          }
          return await this.Project.destroy({ where: { ownerId: userId } });
        } else {
          // delete voucher
          return await this.Voucher.destroy({ where: { participantId: userId } });
        }
      }
    );
  }

  /**
     * Create a voucher for a project
     * @param {Number} projectId 
     * @returns {Promise<Voucher>} created voucher
     */
  async createVoucher(userId) {
    return await this.sequelize.transaction(
      async () => {
        const project = await this.Project.findOne({ where: { ownerId: userId }, attributes: ['id', 'eventId', 'max_tokens'], lock: true });
        if (project === null) {
          throw new Error('No project found');
        }

        var totalVouchers = await this.Voucher.count({ where: { projectId: project.id }, lock: true });
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
        return await this.Voucher.create({ projectId: project.id, id: token, eventId: project.eventId });
      }
    );
  }

  /**
     * Create a attachment for a project
     * @param {Number} userId 
     */
  async getAttachmentSAS(name, userId) {
    const project = await this.Project.findOne({ where: { ownerId: userId }, attributes: ['id'] });
    if (project === null) {
      throw new Error('No project found');
    }
    const azureInfo = await this.AzureBlob.findOne({ 
      where: {
        '$Attachment.ProjectId$': project.id,
        blob_name: name
      },
      include: [ 
        {model: this.Attachment} 
      ] 
    });
    if (azureInfo === null) {
      throw new Error('No attachment found');
    }
    return await this.azure.generateSAS(name);
  }

  /**
     * Create a attachment for a project
     * @param {Number} userId 
     */
  async createAttachment(attachment_fields, userId) {
    return await this.sequelize.transaction(
      async () => {
        // check if we have a project owner
        const project = await this.Project.findOne({ where: { ownerId: userId }, attributes: ['id'] });
        if (project === null) {
          throw new Error('No project found');
        }

        // do some simple "validations"
        // this just checks if the provided files size is bigger than the allowed one 
        // this is user input, you need to validate this later on (TODO look into azure blob hooks)
        const event = project.getEvent();
        if(attachment_fields.size >  event.maxFileSize){
          throw new Error('File validation failed');
        }

        const blobName = uuidv4();
        const containerName = process.env.AZURE_STORAGE_CONTAINER;
    
        // create AzureBlob & create Attachment
        const attachment = await this.AzureBlob.create({
          container_name: containerName,
          blob_name: blobName,
          size: attachment_fields.size,
          Attachment: {
            name: attachment_fields.name,
            filename: attachment_fields.filename, 
            ProjectId: project.id,
            confirmed: false,
            internal: false
          }
        }, {
          include: [{ association: 'Attachment' }] 
        });
        if (attachment === null) {
          throw new Error('Attachment failed');
        }
        const sas = await this.azure.generateSAS(blobName);

        return sas;
      }
    );
  }
  /**
     * Create a attachment for a project
     * @param {Number} attachmentId 
     */
  async deleteAttachment(userId, name) {
    return await this.sequelize.transaction(
      async () => {
        const project = await this.Project.findOne({ where: { ownerId: userId }, attributes: ['id'] });
        if (project === null) {
          throw new Error('No project found');
        }
        // get file linked to the project & not confirmed and not internal
        const azureInfo = await this.AzureBlob.findOne({ 
          where: {
            '$Attachment.ProjectId$': project.id,
            '$Attachment.confirmed$': false,
            '$Attachment.internal$': false,
            blob_name: name
          },
          include: [ 
            {model: this.Attachment} 
          ] 
        });
        if (azureInfo === null) {
          throw new Error('No attachment found');
        }
        await this.Attachment.destroy({ where: { id: azureInfo.Attachment.id } });

        await this.azure.deleteBlob(name);
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
    return await this.Voucher.destroy({ where: { projectId: projectId, participantId: participantId } });
  }

  /**
     * Add participant to a project
     * @param {Number} userId 
     * @param {Number} voucherId 
     * @returns {Promise<User>} created participant
     */
  async addParticipantProject(userId, voucherId) {
    const voucher = await this.Voucher.findOne({ where: { id: voucherId, participantId: null }, lock: true });
    if (voucher === null) {
      throw new Error('Voucher not found');
    }
    await voucher.setParticipant(userId);
    return await voucher.getParticipant();
  }

  /**
     * Add registration
     * @param {Registration} registration
     * @returns {Promise<Registration>} created registration
     */
  async createRegistration(registrationValues) {
    return await this.sequelize.transaction(
      async () => {
        // set the current event
        const event = await this.Event.findOne({ where: { current: true } });
        if (event === null) {
          throw new Error('No Active event found');
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
        dbValues.birthmonth = user.birthmonth;
        dbValues.via = user.via;
        dbValues.medical = user.medical;
        dbValues.gsm = user.gsm;
        dbValues.gsm_guardian = user.gsm_guardian;
        dbValues.email_guardian = user.email_guardian;
        dbValues.sizeId = user.t_size;

        // to month (set hour to 12)
        dbValues.birthmonth
                    = new Date(user.year, user.month, 12);

        // map the questions to the correct table
        const answers = [];
        if(user.general_questions){
          answers.push(...user.general_questions.map(QuestionId => { return { QuestionId }; }));
        }
        if(user.mandatory_approvals){
          answers.push(...user.mandatory_approvals.map(QuestionId => { return { QuestionId }; }));
        }
        dbValues.questions = answers;

        //flatten address
        const address = user.address;
        dbValues.postalcode = address.postalcode;
        dbValues.street = address.street;
        dbValues.house_number = address.house_number;
        dbValues.bus_number = address.bus_number;
        dbValues.municipality_name = address.municipality_name;

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

        // validate mandatory fields for registration 
        // TODO check if question are for the event & mandatory is filled in
        const possibleQuestions = await event.getQuestions();
        console.log(possibleQuestions);

        // check for waiting list
        const registration_count = await this.User.count({ where: { eventId: event.id }, lock: true }) + await this.Registration.count({ lock: true });
        if (registration_count >= event.maxRegistration) {
          dbValues.waiting_list = true;
        }
        return await this.Registration.create(dbValues, { include: [{ model: this.QuestionRegistration, as: 'questions' }] });
      }
    );
  }

  /**
     * Get registration
     * @param {Registration} registration
     * @returns {Promise<Registration>}
     */
  async getRegistration(registrationId) {
    return await this.Registration.findByPk(registrationId, {
      lock: true,
      include: [{ model: this.QuestionRegistration, as: 'questions' },
        { model: this.Event, as: 'event' }]
    });
  }

  /**
     * Add registration
     * @param {Registration} registration
     * @returns {Promise<Registration>}
     */
  async getUser(userId) {
    return this.User.findByPk(userId);
  }

  /**
     * Add registration
     * @param {Registration} registration
     * @returns {Promise<Voucher>} list of vouchers for project
     */
  async getVouchers(userId) {
    var project = await this.Project.findOne({ where: { ownerId: userId }, attributes: ['id'] });
    let vouchers = [];
    if (project !== null) {
      vouchers = await this.Voucher.findAll({
        where: { projectId: project.id }, attributes: ['id'], include: [{
          model: this.User,
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
     * @returns {Promise<Registration>} project information
     */
  async getProject(userId) {
    // first look for own project
    var project = await this.Project.findOne({
      where: { ownerId: userId }, include: [
        {
          model: this.Voucher,
          include: [
            { model: this.User, as: 'participant', attributes: ['firstname', 'lastname', 'id'] }
          ]
        },
        { model: this.User, as: 'owner', attributes: ['firstname', 'lastname'] }
      ]
    });
    // check other project via voucher
    if (project === null) {
      const voucher = await this.Voucher.findOne({ where: { participantId: userId }, attributes: ['projectId'] });
      if (voucher === null) {
        return; //nothing exists on DB -> frontend redirects to no project page
      }
      project = await this.Project.findByPk(voucher.projectId, {
        include: [
          {
            model: this.Voucher,
            include: [
              { model: this.User, as: 'participant', attributes: ['firstname', 'lastname', 'id'] }
            ]
          },
          { model: this.User, as: 'owner', attributes: ['firstname', 'lastname'] }
        ]
      });
    }
    return project;
  }

  /**
     * Check if email address exists in User records table
     * @param {String} email
     * @returns {Promise<Boolean>} 
     */
  async doesEmailExists(emailAddress, event) {
    const count = await this.User.count({ where: { email: emailAddress, eventId: event.id } });
    return count !== 0;
  }
  /**
     * Get user via email
     * @param {String} email
     * @returns {Promise<User>}
     */
  async getUsersViaMail(email) {
    return await this.User.findAll({
      where: {
        [this.Op.or]: [
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
     * @returns {Promise<User>}
     */
  async getOnlyUsersViaMail(email, event) {
    return await this.User.findAll({
      where: {
        email: email,
        eventId: event.id
      }
    });
  }

  /**
     * Update token
     * @param {Number} userId
     * @returns {Promise<User>}
     */
  async updateLastToken(userId) {
    const user = await this.User.findByPk(userId);
    user.last_token = new Date();
    await user.save();
  }

  /**
     * Set the event active
     * @param {Number} eventId
     * @returns {Promise<Event>}
     */
  async setEventActive(eventId) {
    return await this.sequelize.transaction(
      async () => {
        // cancel previous events
        await this.Event.update({ current: false }, { where: {} });

        //activate current
        const event = await this.Event.findByPk(eventId);
        if (event === null) {
          throw new Error('No event found');
        }
        event.current = true;
        return await event.save();
      }
    );
  }

  /**
     * get event by id
     * @param {Number} eventId
     * @returns {Promise<Event>}
     */
  async getEvent(eventId) {
    return await this.Event.findByPk(eventId);
  }

  /**
     * get active event
     * @param {Number} eventId
     * @returns {Promise<Event>}
     */
  async getEventActive() {
    return await this.Event.findOne({
      where: { current: true }, attributes: {
        include: [
          [this.sequelize.literal('(SELECT count(*) from Vouchers where Vouchers.eventID = eventID and Vouchers.participantId IS NULL)'), 'total_unusedVouchers'],
          [this.sequelize.literal('(SELECT count(*) from Vouchers where Vouchers.eventID = eventID and Vouchers.participantId > 0)'), 'total_usedVouchers'],
          [this.sequelize.literal('(SELECT count(*) from Registrations where Registrations.eventId = eventId)'), 'pending_users'],
          [this.sequelize.literal('(SELECT count(*) from Registrations where Registrations.eventId = eventId and waiting_list = 1)'), 'waiting_list'],
          [this.sequelize.literal('(SELECT count(*) from Users where Users.eventId = eventId)'), 'total_users'],
          [this.sequelize.literal('(SELECT count(*) from QuestionUsers where QuestionId = 1)'), 'tphoto'],
          [this.sequelize.literal('(SELECT count(*) from QuestionUsers where QuestionId = 2)'), 'tcontact'],
          [this.sequelize.literal('(SELECT count(*) from QuestionUsers where QuestionId = 4)'), 'tclini'],
          [this.sequelize.literal('(SELECT count(DISTINCT Attachments.ProjectId ) from Attachments)'), 'total_videos'],
          [this.sequelize.literal('(SELECT count(*) from Users where Users.eventId = eventId and Users.sex = \'m\')'), 'total_males'],
          [this.sequelize.literal('(SELECT count(*) from Users where Users.eventId = eventId and Users.sex = \'f\')'), 'total_females'],
          [this.sequelize.literal('(SELECT count(*) from Users where Users.eventId = eventId and Users.sex = \'x\')'), 'total_X'],
          [this.sequelize.literal('(SELECT count(*) from Users where Users.eventId = eventId and Users.language = \'nl\')'), 'tlang_nl'],
          [this.sequelize.literal('(SELECT count(*) from Users where Users.eventId = eventId and Users.language = \'fr\')'), 'tlang_fr'],
          [this.sequelize.literal('(SELECT count(*) from Users where Users.eventId = eventId and Users.language = \'en\')'), 'tlang_en'],
          [this.sequelize.literal('DATEDIFF(eventBeginDate, CURDATE())'), 'days_remaining'],
          [this.sequelize.literal('(SELECT count(*) from Projects where Projects.eventId = eventId)'), 'total_projects'],
          [this.sequelize.literal(`(SELECT count(*) from Registrations where Registrations.eventId = eventId and DATE_ADD(Registrations.createdAt, INTERVAL ${process.env.TOKEN_VALID_TIME} SECOND) < CURDATE() )`), 'overdue_registration']
        ]
      }
    });
  }

  /**
     * get active event
     * @returns {Promise<Event>}
     */
  async getEventDetail(eventId) {
    return await this.Event.findByPk(eventId, {
      attributes: {
        include: [
          [this.sequelize.literal('(SELECT count(*) from Vouchers where Vouchers.eventID = eventID and Vouchers.participantId IS NULL)'), 'total_unusedVouchers'],
          [this.sequelize.literal('(SELECT count(*) from Vouchers where Vouchers.eventID = eventID and Vouchers.participantId > 0)'), 'total_usedVouchers'],
          [this.sequelize.literal('(SELECT count(*) from Registrations where Registrations.eventId = eventId)'), 'pending_users'],
          [this.sequelize.literal('(SELECT count(*) from Registrations where Registrations.eventId = eventId and waiting_list = 1)'), 'waiting_list'],
          [this.sequelize.literal('(SELECT count(*) from Users where Users.eventId = eventId)'), 'total_users'],
          [this.sequelize.literal('(SELECT count(*) from QuestionUsers where QuestionId = 1)'), 'tphoto'],
          [this.sequelize.literal('(SELECT count(*) from QuestionUsers where QuestionId = 2)'), 'tcontact'],
          [this.sequelize.literal('(SELECT count(*) from QuestionUsers where QuestionId = 4)'), 'tclini'],
          [this.sequelize.literal('(SELECT count(DISTINCT Attachments.ProjectId ) from Attachments)'), 'total_videos'],
          [this.sequelize.literal('(SELECT count(*) from Users where Users.eventId = eventId and Users.sex = \'m\')'), 'total_males'],
          [this.sequelize.literal('(SELECT count(*) from Users where Users.eventId = eventId and Users.sex = \'f\')'), 'total_females'],
          [this.sequelize.literal('(SELECT count(*) from Users where Users.eventId = eventId and Users.sex = \'x\')'), 'total_X'],
          [this.sequelize.literal('(SELECT count(*) from Users where Users.eventId = eventId and Users.language = \'nl\')'), 'tlang_nl'],
          [this.sequelize.literal('(SELECT count(*) from Users where Users.eventId = eventId and Users.language = \'fr\')'), 'tlang_fr'],
          [this.sequelize.literal('(SELECT count(*) from Users where Users.eventId = eventId and Users.language = \'en\')'), 'tlang_en'],
          [this.sequelize.literal('DATEDIFF(eventBeginDate, CURDATE())'), 'days_remaining'],
          [this.sequelize.literal('(SELECT count(*) from Projects where Projects.eventId = eventId)'), 'total_projects'],
          [this.sequelize.literal(`(SELECT count(*) from Registrations where Registrations.eventId = eventId and DATE_ADD(Registrations.createdAt, INTERVAL ${process.env.TOKEN_VALID_TIME} SECOND) < CURDATE() )`), 'overdue_registration']
        ]
      }
    });
  }

  async getTshirtsGroups(language) {
    return await this.TShirtGroup.findAll({
      attributes: ['id', 'name'],
      include: [
        {
          model: this.TShirtGroupTranslation,
          where: { [this.Op.or]: [{ language: language }, { language: 'nl' }] },
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
    return await this.TShirt.findAll({
      attributes: ['id', 'name'],
      include: [
        {
          model: this.TShirtGroup, as: 'group', attributes: ['id', 'name'], required: false,
          include: [
            { model: this.TShirtGroupTranslation, where: { [this.Op.or]: [{ language: language }, { language: 'nl' }] }, required: false, attributes: ['language', 'description'] }
          ]
        },
        {
          model: this.TShirtTranslation, where: { [this.Op.or]: [{ language: language }, { language: 'nl' }] }, required: false, attributes: ['language', 'description']
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
    const optionalQuestions = await this.Question.findAll({
      attributes: ['id', 'name'], where: { eventId: event.id, mandatory: { [this.Op.not]: true } }
      , include: [{ model: this.QuestionTranslation, where: { [this.Op.or]: [{ language: language }, { language: process.env.LANG }] }, required: false, attributes: ['language', 'description', 'positive', 'negative'] }]
    });
    return optionalQuestions.map((q) => {
      // default to nl when no translation was found
      let languageIndex = q.QuestionTranslations.findIndex((x) => x.language === language);
      if (languageIndex == -1) {
        languageIndex = q.QuestionTranslations.findIndex((x) => x.language === process.env.LANG);
      }
      return {
        'id': q.id,
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
    const mandatoryQuestions = await this.Question.findAll({
      attributes: ['id', 'name'], where: { eventId: event.id, mandatory: true }
      , include: [{ model: this.QuestionTranslation, where: { [this.Op.or]: [{ language: language }, { language: 'nl' }] }, required: false, attributes: ['language', 'description'] }]
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