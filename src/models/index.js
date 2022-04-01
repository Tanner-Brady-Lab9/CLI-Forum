'use strict';

const { Sequelize, DataTypes } = require('sequelize');
const forumPostModel = require('./forumPost/model.js');
const Collection = require('./data-collection.js');

const DATABASE_URL = process.env.DATABASE_URL || 'sqlite:memory:';

const sequelize = new Sequelize(DATABASE_URL);
const posts = forumPostModel(sequelize, DataTypes);

module.exports = {
  db: sequelize,
  posts: new Collection(posts),
};