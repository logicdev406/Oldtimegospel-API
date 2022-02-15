const db = require('../db/connection');
const Sequelize = require('sequelize');
const { v4: uuidv4 } = require('uuid');

const Post = db.define('posts', {
  id: {
    type: Sequelize.DataTypes.UUID,
    defaultValue: function () {
      return uuidv4();
    },
    primaryKey: true
  },
  title: {
    type: Sequelize.STRING,
    allowNull: false,
    validator: {
      notEmpty: true
    },
    defaultValue: ''
  },
  image: {
    type: Sequelize.STRING,
    allowNull: false,
    validator: {
      notEmpty: true
    },
    defaultValue: ''
  },
  description: {
    type: Sequelize.STRING,
    allowNull: false,
    validator: {
      notEmpty: true
    },
    defaultValue: ''
  },
  lyrics: {
    type: Sequelize.STRING,
    allowNull: false,
    validator: {
      notEmpty: true
    },
    defaultValue: ''
  },
  audio: {
    type: Sequelize.STRING,
    allowNull: false,
    validator: {
      notEmpty: true
    },
    defaultValue: ''
  },
  instagramHandle: {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: ''
  },
  facebookHandle: {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: ''
  }
  // hashtags: {
  //   type: Sequelize.ARRAY(Sequelize.STRING),
  //   allowNull: false,
  //   defaultValue: []
  // }
  // comments: {
  //   type: Sequelize.ARRAY(Sequelize.STRING),
  //   allowNull: false,
  //   defaultValue: ''
  // },
});

module.exports = Post;
