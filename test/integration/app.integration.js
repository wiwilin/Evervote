var expect = require('chai').expect;
const supertest = require('supertest');
const app = require('../../app');

describe('Testing User Log in', function () {
  it('Should redirct to home page after successful login', async function () {
    const res = await supertest(app)
      .post('/users/login')
      .send({ email: 'test@test.com', password: 'test' });
    expect(res.statusCode).to.equal(302);
    expect(res.text).to.equal('Found. Redirecting to /');
  });

  it('Should redirct to signin if email not in system', async function () {
    const res = await supertest(app)
      .post('/users/login')
      .send({ email: '', password: '' });
    expect(res.statusCode).to.equal(302);
    expect(res.text).to.equal('Found. Redirecting to /signin');
  });

  it('Should redirct to signin if login incorrect', async function () {
    const res = await supertest(app)
      .post('/users/login')
      .send({ email: 'test@test.com', password: '' });
    expect(res.statusCode).to.equal(302);
    expect(res.text).to.equal('Found. Redirecting to /signin');
  });
});
