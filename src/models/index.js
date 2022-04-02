'use strict';

const { Sequelize, DataTypes } = require('sequelize');
const forumPostModel = require('./forumPost/model.js');
const Collection = require('./data-collection.js');

const DATABASE_URL_TEST = process.env.DATABASE_URL_TEST || 'sqlite:memory:';

const sequelize = new Sequelize(DATABASE_URL_TEST);
const posts = forumPostModel(sequelize, DataTypes);

module.exports = {
  db: sequelize,
  posts: new Collection(posts),
};