'use strict';


process.env.SECRET = 'secretstring';


let supertest = require('supertest');
let base64 = require('base-64');
let { server } = require('../src/server.js');
let { authDb } = require('../src/auth/models');

let request = supertest(server);

beforeAll( async () => {
  await authDb.sync();
});
afterAll( async () => {
  await authDb.drop();
});


describe('Testing authorization in headers with secret JWT', () => {

  test('allow user to create account',  async () => { 
    let response = await request.post('/signup').send({
      username: 'osknyo',
      password: 'password',
    });
    expect(response.status).toEqual(201);
    expect(response.body.token).toBeTruthy();
  });

  test('should allow user to log in', async () => { 
    let user = 'osknyo:password';
    let encodedUser = await base64.encode(user);
    let response = await request.post('/signin').set('Authorization', `basic ${encodedUser}`);
    expect(response.status).toEqual(200);
    expect(response.body.user.username).toEqual('osknyo');
  });

});