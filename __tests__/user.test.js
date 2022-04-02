'use strict';

let { users, authDb } = require('../src/auth/models');


beforeAll(async () => {
  await authDb.sync();
});

afterAll(async () => {
  await authDb.drop();
});

describe('testing the user model!', () => {
  test('user should have a role and list of capabilities', async () => { 
    let testUser = await users.create({
      username: 'osknyo',
      password: 'password',
    });

    let testWriter = await users.create({
      username: 'osknyoWrite',
      password: 'password',
      role: 'writer',
    });

    let testEditor = await users.create({
      username: 'osknyoEdit',
      password: 'password',
      role: 'editor',
    });

    let testAdmin = await users.create({
      username: 'osknyoAdmin',
      password: 'password',
      role: 'admin',
    });

    expect(testUser.role).toEqual('user');
    expect(testUser.capabilities).toBeTruthy();
    expect(testUser.capabilities.includes('read')).toEqual(true);

    expect(testWriter.role).toEqual('writer');
    expect(testWriter.capabilities).toBeTruthy();
    expect(testWriter.capabilities.includes('create')).toEqual(true);

    expect(testEditor.role).toEqual('editor');
    expect(testEditor.capabilities).toBeTruthy();
    expect(testEditor.capabilities.includes('update')).toEqual(true);

    expect(testAdmin.role).toEqual('admin');
    expect(testAdmin.capabilities).toBeTruthy();
    expect(testAdmin.capabilities.includes('delete')).toEqual(true);

  });
});