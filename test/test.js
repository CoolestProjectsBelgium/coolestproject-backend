const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const Token = require('../jwts');

const models = require('../models');
const projectinfo = require('../paths/projectinfo');
const sequelize = models.sequelize;

var app = null;
describe('Event', function() {
  this.timeout(0);

  before(async () => {      
    process.env.DB = 'sqlite::memory:';
    process.env.NODE_ENV = 'test';

    //init DB
    await sequelize.sync({ force: true });
    console.log('All models were synchronized successfully.');

    //load test data into DB
    const Umzug = require('umzug');

    const umzug = new Umzug({
      migrations: {
        path: './seeders',
        params: [
          sequelize.getQueryInterface()
        ]
      },
      logger: console,
      storage: 'none'
    });
    await umzug.up();

    //start server
    app = require('../app');              
  });

  it('Check for active event', (done) => { 
    chai.request(app).get('/settings').end(function(err, res) {
      expect(res).to.have.status(200);
      done();
    });
  });

  it('Get T-shirts', (done) => { 
    chai.request(app)
      .get('/tshirts')
      .set('Accept-Language', 'nl')
      .end(function(err, res) {
        expect(res).to.have.status(200);
        done();
      });
  });

  it('Get Questions', (done) => { 
    chai.request(app)
      .get('/questions')
      .set('Accept-Language', 'nl')      
      .end(function(err, res) {
        expect(res).to.have.status(200);
        done();
      });
  });

  it('Get Approvals', (done) => { 
    chai.request(app)
      .get('/approvals')
      .set('Accept-Language', 'nl')
      .end(function(err, res) {
        expect(res).to.have.status(200);
        done();
      });
  });

  describe('Registrations', function() {

    it('Basic registration with guardian', (done) => {
      let registration = {
        user: {
          firstname: 'test 123',
          language: 'nl',
          lastname: 'test 123',
          mandatory_approvals: [7],
          general_questions: [5, 6],
          month: 1,
          sex: 'm',
          year: 2009,
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
      
      chai.request(app)
        .post('/register')
        .set('Content-Type', 'application/json')
        .send(registration)
        .end(function(err, res) {
          expect(res).to.have.status(200);
          done();
        });
    });

    it('Basic registration with incorrect guardian info', (done) => {
      let registration = {
        user: {
          firstname: 'test 123',
          language: 'nl',
          lastname: 'test 123',
          mandatory_approvals: [7],
          general_questions: [5, 6],
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
      
      chai.request(app)
        .post('/register')
        .set('Content-Type', 'application/json')
        .send(registration)
        .end(function(err, res) {
          expect(res).to.have.status(500);
          done();
        });
    });

    it('Basic registration without guardian info', (done) => {
      let registration = {
        user: {
          firstname: 'test 123',
          language: 'nl',
          lastname: 'test 123',
          mandatory_approvals: [7],
          general_questions: [5, 6],
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
      
      chai.request(app)
        .post('/register')
        .set('Content-Type', 'application/json')
        .send(registration)
        .end(function(err, res) {
          expect(res).to.have.status(500);
          done();
        });
    });

    it('Basic registration with missing guardian information', (done) => {
      let registration = {
        user: {
          firstname: 'test 123',
          language: 'nl',
          lastname: 'test 123',
          mandatory_approvals: [7],
          general_questions: [5, 6],
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

      chai.request(app)
        .post('/register')
        .set('Content-Type', 'application/json')
        .send(registration)
        .end(function(err, res) {
          expect(res).to.have.status(500);
          done();
        });
    });

    it('Basic registration without mandatory approval', (done) => {
      let registration = {
        user: {
          firstname: 'test 123',
          language: 'nl',
          lastname: 'test 123',
          mandatory_approvals: [],
          general_questions: [5, 6],
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

      chai.request(app)
        .post('/register')
        .set('Content-Type', 'application/json')
        .send(registration)
        .end(function(err, res) {
          expect(res).to.have.status(500);
          done();
        });
    });

    it('Basic registration with incorrect question', (done) => {
      let registration = {
        user: {
          firstname: 'test 123',
          language: 'nl',
          lastname: 'test 123',
          mandatory_approvals: [7],
          general_questions: [1],
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

      chai.request(app)
        .post('/register')
        .set('Content-Type', 'application/json')
        .send(registration)
        .end(function(err, res) {
          expect(res).to.have.status(500);
          done();
        });
    });

    it('Basic registration with incorrect age (to young)', (done) => {
      let registration = {
        user: {
          firstname: 'test 123',
          language: 'nl',
          lastname: 'test 123',
          mandatory_approvals: [7],
          general_questions: [5, 6],
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

      chai.request(app)
        .post('/register')
        .set('Content-Type', 'application/json')
        .send(registration)
        .end(function(err, res) {
          expect(res).to.have.status(500);
          done();
        });
    });

    it('Basic registration with incorrect age (to old)', (done) => {
      let registration = {
        user: {
          firstname: 'test 123',
          language: 'nl',
          lastname: 'test 123',
          mandatory_approvals: [7],
          general_questions: [5, 6],
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

      chai.request(app)
        .post('/register')
        .set('Content-Type', 'application/json')
        .send(registration)
        .end(function(err, res) {
          expect(res).to.have.status(500);
          done();
        });
    });

    it('Registration with subsequent activation', async () => {
      let registration = {
        user: {
          firstname: 'test 123',
          language: 'nl',
          lastname: 'test 123',
          mandatory_approvals: [7],
          general_questions: [5, 6],
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

      expect(result.status).eq(200);

      // just pick the last registration
      let lastRegistration = await models.Registration.findAll({limit: 1, order: [ [ 'id', 'DESC' ]]});

      expect(lastRegistration[0].email).to.be.eq('test@dummy.be');

      let token = await Token.generateRegistrationToken(lastRegistration[0].id); 

      // userinfo automatically creates a user if the bearer token is a registration token
      let userinfo = (await chai.request(app)
        .get('/userinfo')
        .set('Authorization', `Bearer ${token}`)
        .set('Content-Type', 'application/json')
        .send());

      console.log(userinfo.headers)  
      userinfo = userinfo.body;
        
      expect(userinfo).to.not.null;

      console.log(userinfo.email)

      // check if we have a corresponding user
      const user = await models.User.findOne({ where: { email: userinfo.email } });
      expect(user).to.not.null;

      // check if the registration is gone
      const reg = await models.Registration.findByPk(lastRegistration[0].id);
      expect(reg).to.null;

      const login_token = await Token.generateLoginToken(user.id); 

      userinfo.firstname = "change me";

      // update the user with new name (pick cookie)
      let userinfo_updated = await chai.request(app)
      .patch('/userinfo')
      .set('Content-Type', 'application/json')
      .set('Cookie', `jwt=${ login_token }`)
      .send(userinfo);

      expect(userinfo.firstname, 'Username update failed').to.eq(userinfo_updated.body.firstname);

      // get project
      let projectinfo = (await chai.request(app)
        .get('/projectinfo')
        .set('Cookie', `jwt=${ login_token }`)
        .set('Content-Type', 'application/json')
        .send()).body;

      expect(projectinfo).to.not.null; 
      
      projectinfo.own_project.project_name = "change me"

      // update project
      let projectinfo_updated = await chai.request(app)
      .patch('/projectinfo')
      .set('Content-Type', 'application/json')
      .set('Cookie', `jwt=${ login_token }`)
      .send(projectinfo);

      expect(projectinfo.own_project.project_name, 'Project update failed').to.eq(projectinfo_updated.body.own_project.project_name);

      // create token for participant
      let token_success = await chai.request(app)
      .post('/participants')
      .set('Content-Type', 'application/json')
      .set('Cookie', `jwt=${ login_token }`)
      .send();

      expect(token_success.status).eq(200);

      const voucher = await models.User.findByPk(user.id, {
        include: [ { model: models.Project, attributes: ['id'], as: 'project', include: [ { model: models.Voucher, attributes: ['id'] } ] } ]
      });

      expect(voucher).to.not.null; 

      let token_code = voucher.project.Vouchers[0].id;

      // register a participant
      let participant = {
        user: {
          firstname: 'test 123',
          language: 'nl',
          lastname: 'test 123',
          mandatory_approvals: [7],
          general_questions: [5, 6],
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
      
      lastRegistration = await models.Registration.findAll({limit: 1, order: [ [ 'id', 'DESC' ]]});

      token = await Token.generateRegistrationToken(lastRegistration[0].id); 

      // userinfo automatically creates a user if the bearer token is a registration token
      let userinfo_participant = (await chai.request(app)
        .get('/userinfo')
        .set('Authorization', `Bearer ${token}`)
        .set('Content-Type', 'application/json')
        .send());  

      expect(userinfo_participant).to.not.null;

      const participant_user = await models.User.findOne({ where: { email: 'participant@dummy.be' } });
      expect(participant_user).to.not.null;

      //delete the shared project
      let participant_login_token = await Token.generateLoginToken(participant_user.id);
      await chai.request(app)
        .delete('/projectinfo')
        .set('Authorization', `Bearer ${participant_login_token}`)
        .set('Content-Type', 'application/json')
        .send()

      //create new project
      const participant_project = {
        own_project:  {
          project_name: 'participant',
          project_descr: 'participant',
          project_type: 'participant',
          project_lang: 'fr'
        }
      }

      let participant_project_result = (await chai.request(app)
        .post('/projectinfo')
        .set('Authorization', `Bearer ${participant_login_token}`)
        .set('Content-Type', 'application/json')
        .send(participant_project));

      expect(participant_project_result).to.not.null;
      expect(participant_project_result.status).eq(200);

    });    

  });
});