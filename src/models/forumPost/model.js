'use strict';

const forumPostModel = (sequelize, DataTypes) => sequelize.define('Posts', {
  userId: { type: DataTypes.INTEGER, required: true },
  subject: { type: DataTypes.STRING, required: false },
  content: { type: DataTypes.STRING, required: true },
  date: { type: DataTypes.STRING, required: true }, //pass in by Date.now()
});

module.exports = forumPostModel;