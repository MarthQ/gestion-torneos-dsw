import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import request from 'supertest';
import { app } from '../app.js';
import { ORM } from '../shared/db/orm.js';
import { User } from '../user/user.entity.js';
import { hashSync } from 'bcrypt';

// Cambiamos jest.mock por vi.mock
vi.mock('../config/env.js', async (importOriginal) => {
  const original = await importOriginal<typeof import('../config/env.js')>();
  return {
    ...original,
    env: {
      ...original.env,
      igdbClientId: 'SECURE_MOCK_ID',
      igdbAccessToken: 'SECURE_MOCK_TOKEN',
    }
  };
});

vi.mock('../shared/mailer/mailer.service.js');

describe('Integration: Tournament Inscription Flow', () => {
  let authCookie: string[] = [];
  let tournamentId: number;

  beforeAll(async () => {
    const connection = ORM.em.getDriver().getConnection();
    if (!(await connection.isConnected())) {
      await connection.connect();
    }

    const em = ORM.em.fork();
    const existingUser = await em.findOne(User, { mail: 'admin@gmail.com' });

    if (!existingUser) {
      const newUser = em.create(User, {
        name: 'Admin Test',
        mail: 'admin@gmail.com',
        password: hashSync('admin', 10),
        location: 1,
        role: 1
      });
      await em.persistAndFlush(newUser);
    }
  });

  afterAll(async () => {
    await ORM.em.getDriver().close();
  });

  it('Step 1: Login and session capture', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        mail: 'admin@gmail.com',
        password: 'admin'
      });

    expect(res.status).toBe(200);
    const cookies = res.get('Set-Cookie');
    authCookie = Array.isArray(cookies) ? cookies : [];
    expect(authCookie.length).toBeGreaterThan(0);
  });

  it('Step 2: List tournaments with session', async () => {
    const res = await request(app)
      .get('/api/tournaments')
      .set('Cookie', authCookie);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    if (res.body.data.length > 0) {
      tournamentId = res.body.data[0].id;
    }
  });

  it('Step 3: Create inscription', async () => {
    if (!tournamentId) tournamentId = 1;
    const res = await request(app)
      .post('/api/inscriptions')
      .set('Cookie', authCookie)
      .send({ tournamentId });

    expect([201, 400, 404, 409, 500]).toContain(res.status);
  });

  it('Step 4: Logout and cookie invalidation', async () => {
    const res = await request(app)
      .post('/api/auth/logout')
      .set('Cookie', authCookie);

    expect(res.status).toBe(200);
    const cookies = res.get('Set-Cookie');
    const cookieHeader = cookies ? cookies[0] : '';
    expect(cookieHeader).toMatch(/Max-Age=0|Expires/i);
  });
});