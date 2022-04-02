'use strict';

const supertest = require('supertest');
const { server } = require('../src/server');
const request = supertest(server);
const { db, posts } = require('../src/models');
const {users, authDb} = require('../src/auth/models');

let testUserData = {
  admin: {
    username: 'admin',
    password: 'password',
    role: 'admin',
  },
  writer: {
    username: 'writer',
    password: 'password',
    role: 'writer',
  },
  editor: {
    username: 'editor',
    password: 'password',
    role: 'editor',
  },
  user: {
    username: 'user',
    password: 'password',
    role: 'user',
  },
};

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
//   test('allow user to create account',  async () => { 
//     testUser = await request.post('/signup').send({
//       username: 'osknyo',
//       password: 'password',
//     });
//     // console.log('token', testUser._body.user.token);
//     expect(testUser.status).toEqual(201);
//     expect(testUser.body.token).toBeTruthy();
//   });

  test('REST GET ALL', async () => {
    let response = await request.get('/api/v1/posts').set('Authorization', `Bearer ${testUsers[0].token}`);
    expect(response.status).toEqual(200);
    // expect(response.body[0].id).toEqual(1);
  });

  test('REST GET ONE', async () => {
    let response = await request.get('/api/v1/posts/1').set('Authorization', `Bearer ${testUser._body.user.token}`);
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