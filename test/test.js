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

});