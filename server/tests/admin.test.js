import { expect } from 'chai';
import { after, before, beforeEach, describe, it } from 'mocha';
import request from 'supertest';
import app from '../src/app.js';
import { clearTestDb, closeTestDb, connectTestDb } from './setup.js';
import { createUser } from './helpers.js';

describe('admin routes', () => {
  before(connectTestDb);
  beforeEach(clearTestDb);
  after(closeTestDb);

  it('allows admins to list users', async () => {
    const { token } = await createUser({ role: 'admin', email: 'boss@example.com' });
    await createUser({ role: 'user', email: 'customer@example.com' });

    const res = await request(app).get('/api/admin/users').set('Authorization', `Bearer ${token}`);

    expect(res.status).to.equal(200);
    expect(res.body.success).to.equal(true);
    expect(res.body.result.docs).to.have.length(2);
    expect(res.body.result.docs[0].password).to.equal(undefined);
  });

  it('blocks normal users from admin APIs', async () => {
    const { token } = await createUser({ role: 'user', email: 'normal@example.com' });
    const res = await request(app).get('/api/admin/users').set('Authorization', `Bearer ${token}`);

    expect(res.status).to.equal(403);
    expect(res.body.success).to.equal(false);
  });
});
