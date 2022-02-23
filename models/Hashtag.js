const db = require('../db/connection');
const Sequelize = require('sequelize');
const { v4: uuidv4 } = require('uuid');

const Hashtag = db.define('hashtags', {
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
  slug: {
    type: Sequelize.STRING,
    unique: true
  }
});

SequelizeSlugify.slugifyModel(Hashtag, { source: ['title'] });

module.exports = Hashtag;
