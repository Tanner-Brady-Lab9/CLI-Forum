'use strict';

const supertest = require('supertest');
const { server } = require('../src/server');
const request = supertest(server);
const { db, posts } = require('../src/models');
const {users, authDb} = require('../src/auth/models');

let testUser;

beforeAll(async () => {
  await db.sync();
  await authDb.sync();
});

afterAll(async () => {
  await db.drop();
  await authDb.drop();
});

describe('REST API', () => {
  test('allow user to create account',  async () => { 
    testUser = await request.post('/signup').send({
      username: 'osknyo',
      password: 'password',
    });
    expect(testUser.status).toEqual(201);
    expect(testUser.body.token).toBeTruthy();
  });

  test('REST GET ALL', async () => {
    let response = await request.get('/api/v1/posts').set('Authorization', `Bearer ${testUser.token}`);
    expect(response.status).toEqual(200);
    expect(response.body[0].id).toEqual(1);
  });

  test('REST GET ONE', async () => {
    let response = await request.get('/api/v1/posts/1').set('Authorization', `Bearer ${testUser.token}`);
    expect(response.status).toEqual(200);
    expect(response.body.id).toEqual(1);
  });
  
  test('REST POST', async () => {
    let response = await request.post('/api/v1/posts').send({
      userId: 1,
      subject: 'Coding',
      content: 'I love coding, sometimes.',
      data: `Date of note: ${Date.now().toString()}`,
    }).set('Authorization', `Bearer ${testUser.token}`);
    expect(response.status).toEqual(201);
    expect(response.body.subject).toEqual('Coding');
    expect(response.body.content).toEqual('I love coding, sometimes.');
    
  });

  test('REST PUT', async () => {
    let response = await request.put('/api/v1/posts/1').send({
      subject: 'Testing',
    });
    expect(response.status).toEqual(200);
    expect(response.body.subject).toEqual('Testing');
  });

  test('REST DELETE', async () => {
    let response = await request.delete('/api/v1/posts/1');
    expect(response.status).toEqual(200);
  });
});