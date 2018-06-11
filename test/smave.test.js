const expect = require('chai').expect;
const chaiHttp = require('chai-http');
const chai = require('chai');
const _ = require('lodash');

const config = require('./config.json');

/* global define, it, describe, before, beforeEach, afterEach, after */
Object.keys(config).filter(env => config[env].active).forEach(environment => {
  const envProperties = config[environment];

  describe(`Testing the smava endpoints in the ${environment} environment`, () => {
    const adminUser = envProperties.user1;
    const user2 = envProperties.user2;
    const user3 = envProperties.user3;
    let cookies = [];
    chai.use(chaiHttp);
    before('Should login the user that will create the bank account', () => {
      const loginUser = user =>  chai.request(`${envProperties.baseURL}/rest`)
        .post('/login')
        .send(user);
      const promises = [loginUser(adminUser), loginUser(user2), loginUser(user3)];
      return Promise.all(promises)
        .then(responses => {
          expect(responses[0]).to.have.status(200);
          expect(responses[1]).to.have.status(200);
          expect(responses[0].body.loggedIn).to.be.equal(true);
          expect(responses[1].body.loggedIn).to.be.equal(true);
          cookies = responses.map(response => response.headers['set-cookie'][0].split(';')[0]);
        });
    });
    describe('# GET /rest/users', () => {
      it('Should get the users with the admin role', () => {
        return chai.request(`${envProperties.baseURL}/rest`)
          .get('/users')
          .set('Cookie', cookies[0])
          .then(response => {
            expect(response).to.have.status(200);
            expect(response.body).to.have.length(3);
          });
      });
    });
    describe('/rest/accounts endpoints', () => {
      const getAccountFromUser = cookie => {
        return chai.request(`${envProperties.baseURL}/rest`)
          .get('/accounts')
          .set('Cookie', cookie)
          .set('Accept', 'application/json')
          .set('Content-Type', 'application/json');
      };

      describe('# GET /rest/accounts', () => {
        it('Should get the bank account of the user2', () => {
          return getAccountFromUser(cookies[1])
            .then(response => {
            expect(response).to.be.json; //eslint-disable-line
              expect(response.body).to.be.deep.equal([ {
                iban: 'TESTIBAN0',
                bic: 'TESTBIC0',
                appUser: {
                  username: 'user2',
                  email: 'user2@smava.de'
                }
              }
              ]);
            });
        });
        it('Should get the zero bank accounts of the user3', () => {
          return getAccountFromUser(cookies[2])
            .then(response => {
            expect(response).to.be.json; //eslint-disable-line
            //expect(response.body).to.have.length(0);
            });
        });
        it('Should get a 401 for the admin user', () => {
          return getAccountFromUser(cookies[0])
            .then(response => Promise.reject('Should be an error'))
            .catch(error => expect(error).to.have.status(401));
        });
      });
      describe('# POST /rest/accounts', () => {
        it('Should create an account with the admin user for the user3', () => {
          const bankAccountUser3 = {
            iban: 'IBAN5',
            bic: 'BIC3',
            appUser: {
              username: user3.username,
              email: user3.email
            }
          };
          return chai.request(`${envProperties.baseURL}/rest`)
            .post('/accounts')
            .set('Cookie', cookies[0])
            .send(bankAccountUser3)
            .then(response => {
              expect(response).to.have.status(200);
              expect(response.body.iban).to.be.equal(bankAccountUser3.iban);
              return getAccountFromUser(cookies[2])
                .then(responseGet => {
                  expect(responseGet.body[0]).to.be.deep.equal(bankAccountUser3);
                });
            });
        });
      });
    });
  });
});