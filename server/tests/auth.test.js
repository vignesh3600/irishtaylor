import { expect } from 'chai';
import { after, before, beforeEach, describe, it } from 'mocha';
import request from 'supertest';
import app from '../src/app.js';
import { clearTestDb, closeTestDb, connectTestDb } from './setup.js';

describe('auth routes', () => {
  before(connectTestDb);
  beforeEach(clearTestDb);
  after(closeTestDb);

  it('registers a user and returns a token', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Ada Lovelace',
      email: 'ada@example.com',
      password: 'Password123'
    });

    expect(res.status).to.equal(201);
    expect(res.body.success).to.equal(true);
    expect(res.body.result.token).to.be.a('string');
    expect(res.body.result.user.email).to.equal('ada@example.com');
    expect(res.body.result.user.password).to.equal(undefined);
  });

  it('rejects invalid login credentials', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'missing@example.com',
      password: 'wrong'
    });

    expect(res.status).to.equal(401);
    expect(res.body.success).to.equal(false);
    expect(res.body.message).to.equal('Invalid email or password');
  });

  it('validates register payloads', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'A',
      email: 'not-an-email',
      password: 'short'
    });

    expect(res.status).to.equal(422);
    expect(res.body.success).to.equal(false);
    expect(res.body.message).to.be.a('string');
  });
});
