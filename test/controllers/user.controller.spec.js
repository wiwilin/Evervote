var sinon = require('sinon');
var expect = require('chai').expect;
var request = require('supertest');
var assert = require('chai').assert;
var should = require('chai').should();
const users = require('../../models/user');
const userController =  require('../../controllers/user-controller');

describe('userController', function () {
  const mockResponse = (fake) => {
    send: fake;
  };

  const mockRequest = (session, body) => ({
    session,
    body,
  });

  describe('getAllUsers', function () {
    it('Users should have id, and name', async function () {
      const fake = sinon.fake();
      const req = mockRequest({}, {});
      const res = mockResponse(fake);

      result = await userController.findAllUsers(req, res);
      result.forEach(element => {
        expect(element).to.have.property('_id');//check one with chai
        expect(element).to.have.property('name');//check one with chai
      });
    });
  });
});
