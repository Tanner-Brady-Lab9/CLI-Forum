'use strict';

const supertest = require('supertest');
const { server } = require('../src/server');
const request = supertest(server);
const { db, posts } = require('../src/models');
const {users, authDb} = require('../src/auth/models');


const testUsers = [];


beforeAll(async () => {
  await authDb.sync();
  await db.sync();
  await posts.create({
    userId: 1,
    subject: 'Test',
    content: 'We are testing',
  });
  await buildUsers();
});

afterAll(async () => {
  await authDb.drop();
  await db.drop();
});

async function buildUsers() {
  let testAdmin = await users.create({
    username: 'admin',
    password: 'password',
    role: 'admin',
  });
  let testWriter = await users.create({
    username: 'writer',
    password: 'password',
    role: 'writer',
  });
  let testEditor = await users.create({
    username: 'editor',
    password: 'password',
    role: 'editor',
  });
  let testUser = await users.create({
    username: 'user',
    password: 'password',
    role: 'user',
  });

  testUsers.push(testUser);
  testUsers.push(testWriter);
  testUsers.push(testEditor);
  testUsers.push(testAdmin);
}

describe('REST API', () => {

  test('REST GET ALL', async () => {
    let response = await request.get('/api/v1/posts').set('Authorization', `Bearer ${testUsers[0].token}`);
    expect(response.status).toEqual(200);
    expect(response.body[0].id).toEqual(1);
  });

  test('REST GET ONE', async () => {
    let response = await request.get('/api/v1/posts/1').set('Authorization', `Bearer ${testUsers[0].token}`);
    expect(response.status).toEqual(200);
    expect(response.body.id).toEqual(1);
  });
  
  test('REST POST', async () => {
    let response = await request.post('/api/v1/posts').send({
      userId: 1,
      subject: 'Coding',
      content: 'I love coding, sometimes.',
      data: `Date of note: ${Date.now().toString()}`,
    }).set('Authorization', `Bearer ${testUsers[1].token}`);
    expect(response.status).toEqual(201);
    expect(response.body.subject).toEqual('Coding');
    expect(response.body.content).toEqual('I love coding, sometimes.');
    
  });

  test('REST PUT', async () => {
    let response = await request.put('/api/v1/posts/1').send({
      subject: 'Testing',
    }).set('Authorization', `Bearer ${testUsers[2].token}`);
    expect(response.status).toEqual(200);
    expect(response.body.subject).toEqual('Testing');
  });

  test('REST DELETE', async () => {
    let response = await request.delete('/api/v1/posts/1').set('Authorization', `Bearer ${testUsers[3].token}`);
    expect(response.status).toEqual(200);
  });
});