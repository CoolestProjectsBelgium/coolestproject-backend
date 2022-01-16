const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const { Op } = require('sequelize');

const Token = require('../jwts');
const Azure = require('../azure');
const { BlockBlobClient } = require('@azure/storage-blob');

const mockery = require('mockery');
const nodemailerMock = require('nodemailer-mock');

// responses are a bit slower than the standard setting
describe('Event', function () {
  this.timeout(0);

  var app = null;
  var models = null;
  var database = null;

  before(async () => {
    //init azure
    await Azure.syncSetting();

    // setup mocking
    mockery.enable({ warnOnUnregistered: false });
    mockery.registerMock('nodemailer', nodemailerMock);

    //init DB
    class TestDB {
      constructor() {
        const fs = require('fs');
        const path = require('path');
        const Sequelize = require('sequelize');
        const models_dir = path.join(__dirname, '../models');
        const basename = path.basename(models_dir);

        let sequelize = new Sequelize('mysql://coolestproject_test:9b6xgLku9vCP8wy2@db_test:3306/coolestproject_test', {});

        fs
          .readdirSync(models_dir)
          .filter(file => {
            return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js') && file.slice(-8) !== 'index.js';
          })
          .forEach(file => {
            const model = require(path.join(models_dir, file))(sequelize, Sequelize.DataTypes);
            this[model.name] = model;
          });

        Object.keys(this).forEach(modelName => {
          if (this[modelName].associate) {
            this[modelName].associate(this);
          }
        });

        this.sequelize = sequelize;
        this.Sequelize = Sequelize;
      }
    }

    const testDB = new TestDB();
    mockery.registerMock('../models', testDB);
    mockery.registerMock('./models', testDB);
    
    models = require('../models');

    const sequelize = models.sequelize;

    await sequelize.sync({ force: true });
    console.log('All models were synchronized successfully.');

    //load test data into DB
    const Umzug = require('umzug');

    const umzug = new Umzug({
      migrations: {
        path: './test/seeders',
        params: [
          sequelize.getQueryInterface()
        ]
      },
      logger: console,
      storage: 'none'
    });
    await umzug.up();

    const Database = require('../dba');
    database = new Database();

    //start server
    app = require('../app');
  });

  afterEach(async () => {
    // Reset the mock back to the defaults after each test
    nodemailerMock.mock.reset();
  });

  it('Check for active event', (done) => {
    chai.request(app).get('/settings').end(function (err, res) {
      expect(res).to.have.status(200);
      done();
    });
  });

  it('Get T-shirts', (done) => {
    chai.request(app)
      .get('/tshirts')
      .set('Accept-Language', 'nl')
      .end(function (err, res) {
        expect(res).to.have.status(200);
        done();
      });
  });

  it('Get Questions', (done) => {
    chai.request(app)
      .get('/questions')
      .set('Accept-Language', 'nl')
      .end(function (err, res) {
        expect(res).to.have.status(200);
        done();
      });
  });

  it('Get Approvals', (done) => {
    chai.request(app)
      .get('/approvals')
      .set('Accept-Language', 'nl')
      .end(function (err, res) {
        expect(res).to.have.status(200);
        done();
      });
  });

  describe('Registrations', function () {

    it('Basic registration with guardian', async () => {
      const approvals = await chai.request(app).get('/approvals');
      expect(approvals).to.have.status(200);

      const questions = await chai.request(app).get('/questions');
      expect(questions).to.have.status(200);

      let registration = {
        user: {
          firstname: 'test 123',
          language: 'nl',
          lastname: 'test 123',
          mandatory_approvals: approvals.body.map((row) => row.id),
          general_questions: questions.body.map((row) => row.id),
          month: 1,
          sex: 'm',
          year: 2009,
          gsm: '+32460789101',
          gsm_guardian: '+32460789101',
          email_guardian: 'guardian@dummy.be',
          t_size: 1,
          email: 'user_g@dummy.be',
          address: {
            postalcode: '1000'
          }
        },
        project: {
          own_project: {
            project_name: 'test',
            project_descr: 'test',
            project_type: 'test',
            project_lang: 'nl'
          }
        }
      };

      const res = await chai.request(app)
        .post('/register')
        .set('Content-Type', 'application/json')
        .send(registration);

      expect(res).to.have.status(200);
    });

    it('Basic registration with incorrect guardian info', async () => {
      const approvals = await chai.request(app).get('/approvals');
      expect(approvals).to.have.status(200);

      const questions = await chai.request(app).get('/questions');
      expect(questions).to.have.status(200);

      let registration = {
        user: {
          firstname: 'test 123',
          language: 'nl',
          lastname: 'test 123',
          mandatory_approvals: approvals.body.map((row) => row.id),
          general_questions: questions.body.map((row) => row.id),
          month: 12,
          sex: 'm',
          year: 2004,
          gsm: '+32460789101',
          gsm_guardian: '+32460789101',
          email_guardian: 'guardian@dummy.be',
          t_size: 1,
          email: 'user@dummy.be',
          address: {
            postalcode: '1000'
          }
        },
        project: {
          own_project: {
            project_name: 'test',
            project_descr: 'test',
            project_type: 'test',
            project_lang: 'nl'
          }
        }
      };

      const res = await chai.request(app)
        .post('/register')
        .set('Content-Type', 'application/json')
        .send(registration);

      expect(res).to.have.status(500);
    });

    it('Basic registration without guardian info', async () => {
      const approvals = await chai.request(app).get('/approvals');
      expect(approvals).to.have.status(200);

      const questions = await chai.request(app).get('/questions');
      expect(questions).to.have.status(200);

      let registration = {
        user: {
          firstname: 'test 123',
          language: 'nl',
          lastname: 'test 123',
          mandatory_approvals: approvals.body.map((row) => row.id),
          general_questions: questions.body.map((row) => row.id),
          month: 12,
          sex: 'm',
          year: 2004,
          gsm: '+32460789101',
          t_size: 1,
          email: 'user@dummy.be',
          address: {
            postalcode: '1000'
          }
        },
        project: {
          own_project: {
            project_name: 'test',
            project_descr: 'test',
            project_type: 'test',
            project_lang: 'nl'
          }
        }
      };

      const res = await chai.request(app)
        .post('/register')
        .set('Content-Type', 'application/json')
        .send(registration);

      expect(res).to.have.status(200);
    });

    it('Basic registration with missing guardian information', async () => {
      const approvals = await chai.request(app).get('/approvals');
      expect(approvals).to.have.status(200);

      const questions = await chai.request(app).get('/questions');
      expect(questions).to.have.status(200);

      let registration = {
        user: {
          firstname: 'test 123',
          language: 'nl',
          lastname: 'test 123',
          mandatory_approvals: approvals.body.map((row) => row.id),
          general_questions: questions.body.map((row) => row.id),
          month: 1,
          sex: 'm',
          year: 2010,
          gsm: '+32460789101',
          t_size: 1,
          email: 'user@dummy.be',
          address: {
            postalcode: '1000'
          }
        },
        project: {
          own_project: {
            project_name: 'test',
            project_descr: 'test',
            project_type: 'test',
            project_lang: 'nl'
          }
        }
      };

      const res = await chai.request(app)
        .post('/register')
        .set('Content-Type', 'application/json')
        .send(registration);

      expect(res).to.have.status(500);
    });

    it('Basic registration without mandatory approval', async () => {
      const questions = await chai.request(app).get('/questions');
      expect(questions).to.have.status(200);

      let registration = {
        user: {
          firstname: 'test 123',
          language: 'nl',
          lastname: 'test 123',
          mandatory_approvals: [],
          general_questions: questions.body.map((row) => row.id),
          month: 1,
          sex: 'm',
          year: 2010,
          gsm: '+32460789101',
          gsm_guardian: '+32460789101',
          email_guardian: 'guardian@dummy.be',
          t_size: 1,
          email: 'user@dummy.be',
          address: {
            postalcode: '1000'
          }
        },
        project: {
          own_project: {
            project_name: 'test',
            project_descr: 'test',
            project_type: 'test',
            project_lang: 'nl'
          }
        }
      };

      const res = await chai.request(app)
        .post('/register')
        .set('Content-Type', 'application/json')
        .send(registration);

      expect(res).to.have.status(500);
    });

    it('Basic registration with incorrect question', async () => {
      const approvals = await chai.request(app).get('/approvals');
      expect(approvals).to.have.status(200);

      let registration = {
        user: {
          firstname: 'test 123',
          language: 'nl',
          lastname: 'test 123',
          mandatory_approvals: approvals.body.map((row) => row.id),
          general_questions: [100],
          month: 1,
          sex: 'm',
          year: 2010,
          gsm: '+32460789101',
          gsm_guardian: '+32460789101',
          email_guardian: 'guardian@dummy.be',
          t_size: 1,
          email: 'user@dummy.be',
          address: {
            postalcode: '1000'
          }
        },
        project: {
          own_project: {
            project_name: 'test',
            project_descr: 'test',
            project_type: 'test',
            project_lang: 'nl'
          }
        }
      };

      const res = await chai.request(app)
        .post('/register')
        .set('Content-Type', 'application/json')
        .send(registration);

      expect(res).to.have.status(500);
    });

    it('Basic registration with incorrect age (to young)', async () => {
      const approvals = await chai.request(app).get('/approvals');
      expect(approvals).to.have.status(200);

      const questions = await chai.request(app).get('/questions');
      expect(questions).to.have.status(200);

      let registration = {
        user: {
          firstname: 'test 123',
          language: 'nl',
          lastname: 'test 123',
          mandatory_approvals: approvals.body.map((row) => row.id),
          general_questions: questions.body.map((row) => row.id),
          month: 1,
          sex: 'm',
          year: 2020,
          gsm: '+32460789101',
          gsm_guardian: '+32460789101',
          email_guardian: 'guardian@dummy.be',
          t_size: 1,
          email: 'user@dummy.be',
          address: {
            postalcode: '1000'
          }
        },
        project: {
          own_project: {
            project_name: 'test',
            project_descr: 'test',
            project_type: 'test',
            project_lang: 'nl'
          }
        }
      };

      const res = await chai.request(app)
        .post('/register')
        .set('Content-Type', 'application/json')
        .send(registration);

      expect(res).to.have.status(500);
    });

    it('Basic registration with incorrect age (to old)', async () => {
      const approvals = await chai.request(app).get('/approvals');
      expect(approvals).to.have.status(200);

      const questions = await chai.request(app).get('/questions');
      expect(questions).to.have.status(200);

      let registration = {
        user: {
          firstname: 'test 123',
          language: 'nl',
          lastname: 'test 123',
          mandatory_approvals: approvals.body.map((row) => row.id),
          general_questions: questions.body.map((row) => row.id),
          month: 1,
          sex: 'm',
          year: 1901,
          gsm: '+32460789101',
          gsm_guardian: '+32460789101',
          email_guardian: 'guardian@dummy.be',
          t_size: 1,
          email: 'user@dummy.be',
          address: {
            postalcode: '1000'
          }
        },
        project: {
          own_project: {
            project_name: 'test',
            project_descr: 'test',
            project_type: 'test',
            project_lang: 'nl'
          }
        }
      };

      const res = await chai.request(app)
        .post('/register')
        .set('Content-Type', 'application/json')
        .send(registration);

      expect(res).to.have.status(500);
    });

    it('Registration with subsequent activation', async () => {
      const approvals = await chai.request(app).get('/approvals');
      expect(approvals).to.have.status(200);

      const questions = await chai.request(app).get('/questions');
      expect(questions).to.have.status(200);

      let registration = {
        user: {
          firstname: 'test 123',
          language: 'nl',
          lastname: 'test 123',
          mandatory_approvals: approvals.body.map((row) => row.id),
          general_questions: questions.body.map((row) => row.id),
          month: 1,
          sex: 'm',
          year: 2009,
          gsm: '+32460789101',
          gsm_guardian: '+32460789101',
          email_guardian: 'guardian@dummy.be',
          t_size: 1,
          email: 'test@dummy.be',
          address: {
            postalcode: '1000'
          }
        },
        project: {
          own_project: {
            project_name: 'test',
            project_descr: 'test',
            project_type: 'test',
            project_lang: 'nl'
          }
        }
      };

      let result = await chai.request(app)
        .post('/register')
        .set('Content-Type', 'application/json')
        .send(registration);

      expect(result).to.have.status(200);

      let lastRegistration = await models.Registration.findOne({ where: { email: 'test@dummy.be' } });

      expect(lastRegistration.email).to.be.eq('test@dummy.be');

      let token = await Token.generateRegistrationToken(lastRegistration.id);

      // userinfo automatically creates a user if the bearer token is a registration token
      let userinfo = (await chai.request(app)
        .get('/userinfo')
        .set('Authorization', `Bearer ${token}`)
        .set('Content-Type', 'application/json')
        .send());

      console.log(userinfo.headers);
      userinfo = userinfo.body;

      expect(userinfo).to.not.null;

      console.log(userinfo.email);

      // check if we have a corresponding user
      const user = await models.User.findOne({ where: { email: userinfo.email } });
      expect(user).to.not.null;

      // check if the registration is gone
      const reg = await models.Registration.findByPk(lastRegistration.id);
      expect(reg).to.null;

      const login_token = await Token.generateLoginToken(user.id);

      userinfo.firstname = 'change me';

      // update the user with new name (pick cookie)
      let userinfo_updated = await chai.request(app)
        .patch('/userinfo')
        .set('Content-Type', 'application/json')
        .set('Cookie', `jwt=${login_token}`)
        .send(userinfo);

      expect(userinfo.firstname, 'Username update failed').to.eq(userinfo_updated.body.firstname);

      // get project
      let projectinfo = (await chai.request(app)
        .get('/projectinfo')
        .set('Cookie', `jwt=${login_token}`)
        .set('Content-Type', 'application/json')
        .send()).body;

      expect(projectinfo).to.not.null;

      projectinfo.own_project.project_name = 'change me';

      // update project
      let projectinfo_updated = await chai.request(app)
        .patch('/projectinfo')
        .set('Content-Type', 'application/json')
        .set('Cookie', `jwt=${login_token}`)
        .send(projectinfo);

      expect(projectinfo.own_project.project_name, 'Project update failed').to.eq(projectinfo_updated.body.own_project.project_name);

      // create token for participant
      for (let step = 0; step < 3; step++) {
        let token_success = await chai.request(app)
          .post('/participants')
          .set('Content-Type', 'application/json')
          .set('Cookie', `jwt=${login_token}`)
          .send();

        expect(token_success.status).eq(200);
      }
      //test the invalid flow (max tokens reached)
      token_success = await chai.request(app)
        .post('/participants')
        .set('Content-Type', 'application/json')
        .set('Cookie', `jwt=${login_token}`)
        .send();

      expect(token_success.status).eq(500);

      const voucher = await models.User.findByPk(user.id, {
        include: [{ model: models.Project, attributes: ['id'], as: 'project', include: [{ model: models.Voucher, attributes: ['id'] }] }]
      });

      expect(voucher).to.not.null;

      let token_code = voucher.project.Vouchers[0].id;

      // register a participant
      let participant = {
        user: {
          firstname: 'test 123',
          language: 'nl',
          lastname: 'test 123',
          mandatory_approvals: approvals.body.map((row) => row.id),
          general_questions: questions.body.map((row) => row.id),
          month: 1,
          sex: 'm',
          year: 2009,
          gsm: '+32460789101',
          gsm_guardian: '+32460789101',
          email_guardian: 'guardian@dummy.be',
          t_size: 1,
          email: 'participant@dummy.be',
          address: {
            postalcode: '1000'
          }
        },
        project: {
          other_project: {
            project_code: token_code
          }
        }
      };

      result = await chai.request(app)
        .post('/register')
        .set('Content-Type', 'application/json')
        .send(participant);

      lastRegistration = await models.Registration.findAll({ limit: 1, order: [['id', 'DESC']] });

      token = await Token.generateRegistrationToken(lastRegistration[0].id);

      // userinfo automatically creates a user if the bearer token is a registration token
      let userinfo_participant = (await chai.request(app)
        .get('/userinfo')
        .set('Authorization', `Bearer ${token}`)
        .set('Content-Type', 'application/json')
        .send());

      expect(userinfo_participant).to.not.null;

      let participant_user = await models.User.findOne({ where: { email: 'participant@dummy.be' } });
      expect(participant_user).to.not.null;

      //delete the shared project
      let participant_login_token = await Token.generateLoginToken(participant_user.id);
      await chai.request(app)
        .delete('/projectinfo')
        .set('Authorization', `Bearer ${participant_login_token}`)
        .set('Content-Type', 'application/json')
        .send();

      //create new project
      let participant_project = {
        own_project: {
          project_name: 'participant',
          project_descr: 'participant',
          project_type: 'participant',
          project_lang: 'fr'
        }
      };

      let participant_project_result = (await chai.request(app)
        .post('/projectinfo')
        .set('Authorization', `Bearer ${participant_login_token}`)
        .set('Content-Type', 'application/json')
        .send(participant_project));

      expect(participant_project_result).to.not.null;
      expect(participant_project_result.status).eq(200);

      participant_user = await models.User.findOne({ where: { email: 'participant@dummy.be' }, include: [{ model: models.Project, as: 'project' }] });
      expect(participant_user.project.project_name).to.eq('participant');

      //delete my own project again & relink to the existing one
      participant_project_result = (await chai.request(app)
        .delete('/projectinfo')
        .set('Authorization', `Bearer ${participant_login_token}`)
        .set('Content-Type', 'application/json')
        .send());

      expect(participant_project_result.status).eq(200);

      // just pick next token
      token_code = voucher.project.Vouchers[1].id;

      participant_project = {
        other_project: {
          project_code: token_code
        }
      };

      // link user again to project
      participant_project_result = (await chai.request(app)
        .post('/projectinfo')
        .set('Authorization', `Bearer ${participant_login_token}`)
        .set('Content-Type', 'application/json')
        .send(participant_project));

      expect(participant_project_result.status).eq(200);

      // try to delete user
      let participant_user_result = (await chai.request(app)
        .delete('/userinfo')
        .set('Authorization', `Bearer ${participant_login_token}`)
        .set('Content-Type', 'application/json')
        .send());

      expect(participant_user_result.status).eq(500);

      // delete participation again
      participant_project_result = (await chai.request(app)
        .delete('/projectinfo')
        .set('Authorization', `Bearer ${participant_login_token}`)
        .set('Content-Type', 'application/json')
        .send());

      expect(participant_project_result.status).eq(200);

      // delete the user for real
      participant_user_result = (await chai.request(app)
        .delete('/userinfo')
        .set('Authorization', `Bearer ${participant_login_token}`)
        .set('Content-Type', 'application/json')
        .send());

      expect(participant_user_result.status).eq(200);

      // check if the tokens are gone
      let voucher_exists = await models.Voucher.findOne({
        where: { [Op.or]: [{ id: voucher.project.Vouchers[1].id }, { id: voucher.project.Vouchers[0].id }] }
      });

      expect(voucher_exists).is.null;

    });

    it('Add and remove attachments', async () => {
      const approvals = await chai.request(app).get('/approvals');
      expect(approvals).to.have.status(200);

      const questions = await chai.request(app).get('/questions');
      expect(questions).to.have.status(200);

      let registration = {
        user: {
          firstname: 'test 123',
          language: 'nl',
          lastname: 'test 123',
          mandatory_approvals: approvals.body.map((row) => row.id),
          general_questions: questions.body.map((row) => row.id),
          month: 1,
          sex: 'm',
          year: 2009,
          gsm: '+32460789101',
          gsm_guardian: '+32460789101',
          email_guardian: 'guardian@dummy.be',
          t_size: 1,
          email: 'test1@dummy.be',
          address: {
            postalcode: '1000'
          }
        },
        project: {
          own_project: {
            project_name: 'test',
            project_descr: 'test',
            project_type: 'test',
            project_lang: 'nl'
          }
        }
      };

      let result = await chai.request(app)
        .post('/register')
        .set('Content-Type', 'application/json')
        .send(registration);

      expect(result.status).eq(200);

      // just pick the last registration
      let lastRegistration = await models.Registration.findAll({ limit: 1, order: [['id', 'DESC']] });

      expect(lastRegistration[0].email).to.be.eq('test1@dummy.be');

      let token = await Token.generateRegistrationToken(lastRegistration[0].id);

      // userinfo automatically creates a user if the bearer token is a registration token
      let userinfo = (await chai.request(app)
        .get('/userinfo')
        .set('Authorization', `Bearer ${token}`)
        .set('Content-Type', 'application/json')
        .send());

      expect(userinfo).to.not.null;

      const user = await models.User.findOne({ where: { email: 'test1@dummy.be' } });
      expect(user).to.not.null;

      token = await Token.generateLoginToken(user.id);

      // add attachments
      let attachments = (await chai.request(app)
        .post('/attachments')
        .set('Authorization', `Bearer ${token}`)
        .set('Content-Type', 'application/json')
        .send({ name: 'test', size: 100, filename: 'test' }));

      expect(attachments.status).eq(200);

      // get the azure info
      const attachment = await (await (await user.getProject()).getAttachments())[0].getAzureBlob();

      // check if the SAS url has all the correct information
      let sas_url = attachments.body.url;
      expect(sas_url).include(attachment.blob_name);
      expect(sas_url).include(attachment.container_name);

      // refresh sas token
      let sas_url_response = (await chai.request(app)
        .post(`/attachments/${attachment.blob_name}/sas`)
        .set('Authorization', `Bearer ${token}`)
        .set('Content-Type', 'application/json')
        .send());

      sas_url = sas_url_response.body.url;
      expect(sas_url).include(attachment.blob_name);
      expect(sas_url).include(attachment.container_name);

      console.log(attachment);

      // fake the azure upload logic
      const data = 'Hello, World!';
      const blockBlobClient = new BlockBlobClient(
        sas_url
      );
      await blockBlobClient.upload(data, data.length);

      //get the download url
      let projectinfo = (await chai.request(app)
        .get('/projectinfo')
        .set('Authorization', `Bearer ${token}`)
        .set('Content-Type', 'application/json')
        .send()).body;

      expect(projectinfo).not.null;

      let project_attachment = projectinfo.attachments[0];

      expect(project_attachment.exists).to.be.true;

      const sas_response = await chai.request(project_attachment.url).get('');
      expect(sas_response.status).eq(200);

      // delete the attachment
      attachments = await chai.request(app)
        .delete(`/attachments/${attachment.blob_name}`)
        .set('Authorization', `Bearer ${token}`)
        .set('Content-Type', 'application/json')
        .send();

      expect(attachments.status).eq(200);

      // check if the attachment is gone
      projectinfo = (await chai.request(app)
        .get('/projectinfo')
        .set('Authorization', `Bearer ${token}`)
        .set('Content-Type', 'application/json')
        .send()).body;

      project_attachment = projectinfo.attachments[0];

      expect(project_attachment).to.be.undefined;

    });

    it('Login logout', async () => {
      const approvals = await chai.request(app).get('/approvals');
      expect(approvals).to.have.status(200);

      const questions = await chai.request(app).get('/questions');
      expect(questions).to.have.status(200);

      let registration = {
        user: {
          firstname: 'test 123',
          language: 'nl',
          lastname: 'test 123',
          mandatory_approvals: approvals.body.map((row) => row.id),
          general_questions: questions.body.map((row) => row.id),
          month: 1,
          sex: 'm',
          year: 2009,
          gsm: '+32460789101',
          gsm_guardian: '+32460789101',
          email_guardian: 'guardian@dummy.be',
          t_size: 1,
          email: 'test2@dummy.be',
          address: {
            postalcode: '1000'
          }
        },
        project: {
          own_project: {
            project_name: 'test',
            project_descr: 'test',
            project_type: 'test',
            project_lang: 'nl'
          }
        }
      };

      let result = await chai.request(app)
        .post('/register')
        .set('Content-Type', 'application/json')
        .send(registration);

      expect(result.status).eq(200);

      // just pick the last registration
      let lastRegistration = await models.Registration.findAll({ limit: 1, order: [['id', 'DESC']] });

      expect(lastRegistration[0].email).to.be.eq('test2@dummy.be');

      let token = await Token.generateRegistrationToken(lastRegistration[0].id);

      // userinfo automatically creates a user if the bearer token is a registration token
      let userinfo = (await chai.request(app)
        .get('/userinfo')
        .set('Authorization', `Bearer ${token}`)
        .set('Content-Type', 'application/json')
        .send());

      expect(userinfo.status).eq(200);

      let user = await models.User.findOne({ where: { email: 'test2@dummy.be' }, attributes: ['id'] });
      expect(user).to.not.null;

      let mail_token_response = (await chai.request(app)
        .post('/mailToken')
        .set('Content-Type', 'application/json')
        .send({ email: 'test2@dummy.be' }));

      expect(mail_token_response.status).eq(200);

      // quick way to get the token out of the text part of the second mail (ask4Token mail)
      const sentMail = nodemailerMock.mock.getSentMail();

      let link = sentMail[1].text.split(/\r?\n/)[7];
      link = link.substring(1, link.length - 1);

      let token_mail = link.split('?token=')[1];

      // trigger the login via the backend post (standard flow reads out the query string in the frontend & post to /login)
      let login_response = (await chai.request(app)
        .post('/login')
        .set('Authorization', `Bearer ${token_mail}`)
        .set('Content-Type', 'application/json')
        .send());

      expect(login_response.status).eq(200);

      expect(login_response).to.have.cookie('jwt');

      // test the logout functionality
      // /login sets a cookie so no bearer header needed
      let logout_response = (await chai.request(app)
        .post('/logout')
        .set('Content-Type', 'application/json')
        .send());

      expect(logout_response).to.not.have.cookie('jwt');

    });

    it('Waiting mail list', async () => {
      const approvals = await chai.request(app).get('/approvals');
      expect(approvals).to.have.status(200);

      const questions = await chai.request(app).get('/questions');
      expect(questions).to.have.status(200);

      // change the event to trigger the waiting list logic
      const event = await database.getEventActive();
      const maxReg = event.maxRegistration;
      event.maxRegistration = 0;
      await event.save();

      let registration = {
        user: {
          firstname: 'test 123',
          language: 'nl',
          lastname: 'test 123',
          mandatory_approvals: approvals.body.map((row) => row.id),
          general_questions: questions.body.map((row) => row.id),
          month: 1,
          sex: 'm',
          year: 2009,
          gsm: '+32460789101',
          gsm_guardian: '+32460789101',
          email_guardian: 'guardian@dummy.be',
          t_size: 1,
          email: 'test3@dummy.be',
          address: {
            postalcode: '1000'
          }
        },
        project: {
          own_project: {
            project_name: 'test',
            project_descr: 'test',
            project_type: 'test',
            project_lang: 'nl'
          }
        }
      };

      let result = await chai.request(app)
        .post('/register')
        .set('Content-Type', 'application/json')
        .send(registration);

      expect(result.status).eq(200);

      const sentMail = nodemailerMock.mock.getSentMail();

      expect('Coolest Projects 2022: Welcome to the waiting list').eq(sentMail[0].subject);

      //reset event again TODO find better way
      event.maxRegistration = maxReg;
      await event.save();
    });

    it('Try to register with existing user', async () => {
      const approvals = await chai.request(app).get('/approvals');
      expect(approvals).to.have.status(200);

      const questions = await chai.request(app).get('/questions');
      expect(questions).to.have.status(200);

      let registration = {
        user: {
          firstname: 'test 123',
          language: 'nl',
          lastname: 'test 123',
          mandatory_approvals: approvals.body.map((row) => row.id),
          general_questions: questions.body.map((row) => row.id),
          month: 1,
          sex: 'm',
          year: 2009,
          gsm: '+32460789101',
          gsm_guardian: '+32460789101',
          email_guardian: 'guardian@dummy.be',
          t_size: 1,
          email: 'test4@dummy.be',
          address: {
            postalcode: '1000'
          }
        },
        project: {
          own_project: {
            project_name: 'test',
            project_descr: 'test',
            project_type: 'test',
            project_lang: 'nl'
          }
        }
      };

      let result = await chai.request(app)
        .post('/register')
        .set('Content-Type', 'application/json')
        .send(registration);

      expect(result.status).eq(200);

      // just pick the last registration
      let lastRegistration = await models.Registration.findOne({ where: { email: 'test4@dummy.be' } });

      expect(lastRegistration.email).to.be.eq('test4@dummy.be');

      let token = await Token.generateRegistrationToken(lastRegistration.id);

      // userinfo automatically creates a user if the bearer token is a registration token
      let userinfo = (await chai.request(app)
        .get('/userinfo')
        .set('Authorization', `Bearer ${token}`)
        .set('Content-Type', 'application/json')
        .send());

      expect(userinfo.status).eq(200);

      result = await chai.request(app)
        .post('/register')
        .set('Content-Type', 'application/json')
        .send(registration);

      expect(result.status).eq(200);

      const sentMail = nodemailerMock.mock.getSentMail();

      expect('Coolest Projects : Let op, er was een aanvullende registratie met jouw e-mailadres.').eq(sentMail[2].subject);

    });

    it('Release user from waiting list', async () => {
      const approvals = await chai.request(app).get('/approvals');
      expect(approvals).to.have.status(200);

      const questions = await chai.request(app).get('/questions');
      expect(questions).to.have.status(200);

      // change the event to trigger the waiting list logic
      const event = await database.getEventActive();
      const maxReg = event.maxRegistration;

      const registration_count = await models.User.count({ where: { eventId: event.id } }) + await models.Registration.count({ where: { eventId: event.id } });
      event.maxRegistration = registration_count + 1;
      await event.save();

      let registration = {
        user: {
          firstname: 'test 123',
          language: 'nl',
          lastname: 'test 123',
          mandatory_approvals: approvals.body.map((row) => row.id),
          general_questions: questions.body.map((row) => row.id),
          month: 1,
          sex: 'm',
          year: 2009,
          gsm: '+32460789101',
          gsm_guardian: '+32460789101',
          email_guardian: 'guardian@dummy.be',
          t_size: 1,
          email: 'test5@dummy.be',
          address: {
            postalcode: '1000'
          }
        },
        project: {
          own_project: {
            project_name: 'test',
            project_descr: 'test',
            project_type: 'test',
            project_lang: 'nl'
          }
        }
      };

      let result = await chai.request(app)
        .post('/register')
        .set('Content-Type', 'application/json')
        .send(registration);

      expect(result.status).eq(200);

      let lastRegistration = await models.Registration.findOne({ where: { email: 'test5@dummy.be' } });

      expect(lastRegistration.email).to.be.eq('test5@dummy.be');

      let token = await Token.generateRegistrationToken(lastRegistration.id);

      // userinfo automatically creates a user if the bearer token is a registration token
      let userinfo = (await chai.request(app)
        .get('/userinfo')
        .set('Authorization', `Bearer ${token}`)
        .set('Content-Type', 'application/json')
        .send());

      const user = await models.User.findOne({ where: { email: 'test5@dummy.be' } });
      expect(user).to.not.null;

      let user_token = await Token.generateLoginToken(user.id);

      let registration_wait = {
        user: {
          firstname: 'test 123',
          language: 'nl',
          lastname: 'test 123',
          mandatory_approvals: approvals.body.map((row) => row.id),
          general_questions: questions.body.map((row) => row.id),
          month: 1,
          sex: 'm',
          year: 2009,
          gsm: '+32460789101',
          gsm_guardian: '+32460789101',
          email_guardian: 'guardian@dummy.be',
          t_size: 1,
          email: 'test6@dummy.be',
          address: {
            postalcode: '1000'
          }
        },
        project: {
          own_project: {
            project_name: 'test',
            project_descr: 'test',
            project_type: 'test',
            project_lang: 'nl'
          }
        }
      };

      let result_wait = await chai.request(app)
        .post('/register')
        .set('Content-Type', 'application/json')
        .send(registration_wait);

      expect(result_wait.status).eq(200);

      let sentMail = nodemailerMock.mock.getSentMail();

      expect(sentMail).is.length(3);
      expect('Coolest Projects 2022: Bevestig jouw registratie aub').eq(sentMail[0].subject);
      expect('Coolest Projects 2022: Welkom!').eq(sentMail[1].subject);
      expect('Coolest Projects 2022: Welcome to the waiting list').eq(sentMail[2].subject);

      let waitingListUser = await models.Registration.findOne({ where: { waiting_list: true } });
      expect(waitingListUser).to.not.null;

      // delete project & user
      let projectinfo = await chai.request(app)
        .delete('/projectinfo')
        .set('Authorization', `Bearer ${user_token}`)
        .set('Content-Type', 'application/json')
        .send();

      userinfo = await chai.request(app)
        .delete('/userinfo')
        .set('Authorization', `Bearer ${user_token}`)
        .set('Content-Type', 'application/json')
        .send();

      //delete of user info triggers the new user creation
      waitingListUser = await models.Registration.findOne({ where: { waiting_list: true } });
      expect(waitingListUser).to.be.null;

      sentMail = nodemailerMock.mock.getSentMail();

      expect(sentMail).is.length(5);

      expect('Coolest Projects 2022: Bevestiging verwijderen van jouw project').eq(sentMail[3].subject);
      expect('Coolest Projects 2022: Bevestig jouw registratie aub').eq(sentMail[4].subject);

      //reset event again TODO find better way
      event.maxRegistration = maxReg;
      await event.save();

    });

    it('Check copy of guardian fields', async () => {
      const approvals = await chai.request(app).get('/approvals');
      expect(approvals).to.have.status(200);

      const questions = await chai.request(app).get('/questions');
      expect(questions).to.have.status(200);

      let registration = {
        user: {
          firstname: 'test 123',
          language: 'nl',
          lastname: 'test 123',
          mandatory_approvals: approvals.body.map((row) => row.id),
          general_questions: questions.body.map((row) => row.id),
          month: 1,
          sex: 'm',
          year: 2009,
          gsm: '+32460789101',
          gsm_guardian: '+32460789101',
          email_guardian: 'test7_guardian@dummy.be',
          t_size: 1,
          email: 'test7@dummy.be',
          address: {
            postalcode: '1000',
            box_number: 'aaa'
          }
        },
        project: {
          own_project: {
            project_name: 'test',
            project_descr: 'test',
            project_type: 'test',
            project_lang: 'nl'
          }
        }
      };

      let result = await chai.request(app)
        .post('/register')
        .set('Content-Type', 'application/json')
        .send(registration);

      expect(result.status).eq(200);

      let lastRegistration = await models.Registration.findOne({ where: { email: 'test7@dummy.be' } });

      expect(lastRegistration.email).to.be.eq('test7@dummy.be');
      expect(lastRegistration.box_number).to.be.eq('aaa');
      expect(lastRegistration.email_guardian).to.be.eq('test7_guardian@dummy.be');

      let token = await Token.generateRegistrationToken(lastRegistration.id);

      // userinfo automatically creates a user if the bearer token is a registration token
      let userinfo = (await chai.request(app)
        .get('/userinfo')
        .set('Authorization', `Bearer ${token}`)
        .set('Content-Type', 'application/json')
        .send());

      // check the copy of the user data
      let lastUser = await models.User.findOne({ where: { email: 'test7@dummy.be' } });
      expect(lastUser).not.null;

      expect(lastUser.email).to.be.eq('test7@dummy.be');
      expect(lastUser.box_number).to.be.eq('aaa');
      expect(lastUser.email_guardian).to.be.eq('test7_guardian@dummy.be');

    });
  });
});
