const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const models = require('../models');
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

    const registration = {
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
        gsm_guardian: '+32460789101',
        email_guardian: 'guardian@dummy.be',     
        t_size: 1,
        email: 'user@dummy.be',
        address: {
          postalcode: "1000"
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
    }

    it('Basic registration with guardian', (done) => {
      chai.request(app)
        .post('/register')
        .set('Content-Type', 'application/json')
        .send(registration)
        .end(function(err, res) {
          expect(res).to.have.status(200);
          done();
        });
    });

    it('Basic registration without guardian failure case', (done) => {
      let without_guardian = registration;
      delete without_guardian.user.gsm_guardian;
      delete without_guardian.user.email_guardian;

      chai.request(app)
        .post('/register')
        .set('Content-Type', 'application/json')
        .send(without_guardian)
        .end(function(err, res) {
          expect(res).to.have.status(500);
          done();
        });
    });
  });

});