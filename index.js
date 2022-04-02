'use strict';

require('dotenv').config();
const { db } = require('./src/models');
const { authDb } = require('./src/auth/models');
const server = require('./src/server.js');

db.sync().then(() => {
  authDb.sync().then(() => {
    server.start(process.env.PORT||3000);
  });
});
