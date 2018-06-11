const expect = require('chai').expect;
const chaiHttp = require('chai-http');
const chai = require('chai');
const _ = require('lodash');

const config = require('./config.json');

/* global define, it, describe, before, beforeEach, afterEach, after */
Object.keys(config).filter(env => config[env].active).forEach(environment => {
  const envProperties = config[environment];

  describe(`Testing the smava endpoints in the ${environment} environment`, () => {
    before('Include the chai-http modules', () => {
      chai.use(chaiHttp);
    });
    it('Should return 401', () => {
      return chai.request(`${envProperties.baseURL}/rest`)
        .get('/users')
        .then(response => Promise.reject('Should be an error'))
        .catch(response => expect(response).to.have.status(401));
    });
  });
});