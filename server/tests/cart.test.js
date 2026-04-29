import { expect } from 'chai';
import { after, before, beforeEach, describe, it } from 'mocha';
import request from 'supertest';
import app from '../src/app.js';
import { clearTestDb, closeTestDb, connectTestDb } from './setup.js';
import { createProduct, createUser } from './helpers.js';

describe('cart routes', () => {
  before(connectTestDb);
  beforeEach(clearTestDb);
  after(closeTestDb);

  it('lets users add products to cart', async () => {
    const { token } = await createUser({ role: 'user', email: 'cart-user@example.com' });
    const product = await createProduct({ stock: 5 });

    const res = await request(app)
      .post('/api/cart/items')
      .set('Authorization', `Bearer ${token}`)
      .send({ productId: product.id, quantity: 2 });

    expect(res.status).to.equal(201);
    expect(res.body.success).to.equal(true);
    expect(res.body.result.items).to.have.length(1);
  });

  it('blocks cart access for admins', async () => {
    const { token } = await createUser({ role: 'admin', email: 'cart-admin@example.com' });
    const res = await request(app).get('/api/cart').set('Authorization', `Bearer ${token}`);

    expect(res.status).to.equal(403);
    expect(res.body.success).to.equal(false);
  });

  it('rejects quantities above available stock', async () => {
    const { token } = await createUser({ role: 'user', email: 'limited@example.com' });
    const product = await createProduct({ stock: 1 });

    const res = await request(app)
      .post('/api/cart/items')
      .set('Authorization', `Bearer ${token}`)
      .send({ productId: product.id, quantity: 2 });

    expect(res.status).to.equal(400);
    expect(res.body.success).to.equal(false);
    expect(res.body.message).to.equal('Requested quantity exceeds available stock');
  });
});
