import { expect } from 'chai';
import { after, before, beforeEach, describe, it } from 'mocha';
import request from 'supertest';
import app from '../src/app.js';
import { clearTestDb, closeTestDb, connectTestDb } from './setup.js';
import { createProduct, createUser } from './helpers.js';

const payload = {
  name: 'Denim Jacket',
  description: 'A structured denim jacket with sturdy stitching.',
  brand: 'Urban Loom',
  category: 'jackets',
  size: 'L',
  color: 'Blue',
  price: 3299,
  stock: 4,
  imageUrl: 'https://example.com/jacket.jpg'
};

describe('product routes', () => {
  before(connectTestDb);
  beforeEach(clearTestDb);
  after(closeTestDb);

  it('allows admins to create products', async () => {
    const { token } = await createUser({ role: 'admin', email: 'admin@example.com' });
    const res = await request(app).post('/api/products').set('Authorization', `Bearer ${token}`).send(payload);

    expect(res.status).to.equal(201);
    expect(res.body.success).to.equal(true);
    expect(res.body.result.name).to.equal(payload.name);
  });

  it('blocks users from admin product endpoints', async () => {
    const { token } = await createUser({ role: 'user', email: 'user@example.com' });
    const res = await request(app).post('/api/products').set('Authorization', `Bearer ${token}`).send(payload);

    expect(res.status).to.equal(403);
    expect(res.body.success).to.equal(false);
  });

  it('returns 404 when product is not found', async () => {
    const res = await request(app).get('/api/products/64b7f5c4c9a1a2b3c4d5e6f7');

    expect(res.status).to.equal(404);
    expect(res.body.success).to.equal(false);
    expect(res.body.message).to.equal('Product not found');
  });

  it('lists paginated products', async () => {
    await createProduct();
    const res = await request(app).get('/api/products');

    expect(res.status).to.equal(200);
    expect(res.body.success).to.equal(true);
    expect(res.body.result.docs).to.have.length(1);
    expect(res.body.result.totalDocs).to.equal(1);
  });
});
