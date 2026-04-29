import { expect } from 'chai';
import { after, before, beforeEach, describe, it } from 'mocha';
import request from 'supertest';
import app from '../src/app.js';
import { clearTestDb, closeTestDb, connectTestDb } from './setup.js';
import { createUser } from './helpers.js';

const tinyPng = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/p9sAAAAASUVORK5CYII=',
  'base64'
);

describe('upload routes', () => {
  before(connectTestDb);
  beforeEach(clearTestDb);
  after(closeTestDb);

  it('allows admins to upload product images', async () => {
    const { token } = await createUser({ role: 'admin', email: 'upload-admin@example.com' });

    const res = await request(app)
      .post('/api/upload/product-image')
      .set('Authorization', `Bearer ${token}`)
      .attach('image', tinyPng, { filename: 'product.png', contentType: 'image/png' });

    expect(res.status).to.equal(201);
    expect(res.body.success).to.equal(true);
    expect(res.body.result.url).to.match(/^\/uploads\/products\/.+\.png$/);
  });

  it('blocks users from uploading product images', async () => {
    const { token } = await createUser({ role: 'user', email: 'upload-user@example.com' });

    const res = await request(app)
      .post('/api/upload/product-image')
      .set('Authorization', `Bearer ${token}`)
      .attach('image', tinyPng, { filename: 'product.png', contentType: 'image/png' });

    expect(res.status).to.equal(403);
    expect(res.body.success).to.equal(false);
  });
});
