'use strict';

const supertest = require('supertest');
const { server } = require('../src/server');
const request = supertest(server);
const { db, posts } = require('../src/models');

beforeAll(async () => {
  await db.sync();
});

afterAll(async () => {
  await db.drop();
});

describe('REST API', () => {
  test('REST POST', async () => {
    let response = await request.post('/api/v1/posts').send({
      userId: 1,
      subject: 'Coding',
      content: 'I love coding, sometimes.',
      data: `Date of note: ${Date.now().toString()}`,
    });

    expect(response.status).toEqual(201);
    expect(response.body.subject).toEqual('Coding');
    expect(response.body.content).toEqual('I love coding, sometimes.');
    
  });

  test('REST GET ALL', async () => {
    let response = await request.get('/api/v1/posts');

    expect(response.status).toEqual(200);
    expect(response.body[0].id).toEqual(1);

  });

  test('REST GET ONE', async () => {
    let response = await request.get('/api/v1/posts/1');

    expect(response.status).toEqual(200);
    expect(response.body.id).toEqual(1);

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

// describe('Auth Middleware', () => {

//   // admin:password: YWRtaW46cGFzc3dvcmQ=
//   // admin:foo: YWRtaW46Zm9v

//   // Mock the express req/res/next that we need for each middleware call
//   const req = {};
//   const res = {
//     status: jest.fn(() => res),
//     send: jest.fn(() => res)
//   }
//   const next = jest.fn();

//   describe('user authentication', () => {

//     it('fails a login for a user (admin) with the incorrect basic credentials', () => {

//       // Change the request to match this test case
//       req.headers = {
//         authorization: 'Basic YWRtaW46Zm9v',
//       };

//       return middleware(req, res, next)
//         .then(() => {
//           expect(next).not.toHaveBeenCalled();
//           expect(res.status).toHaveBeenCalledWith(403);
//         });

//     }); // it()

//     it('logs in an admin user with the right credentials', () => {

//       // Change the request to match this test case
//       req.headers = {
//         authorization: 'Basic YWRtaW46cGFzc3dvcmQ=',
//       };

//       return middleware(req, res, next)
//         .then(() => {
//           expect(next).toHaveBeenCalledWith();
//         });

//     }); // it()

//   });

// });
