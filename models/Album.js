const db = require('../db/connection');
const Sequelize = require('sequelize');
const { v4: uuidv4 } = require('uuid');
const SequelizeSlugify = require('sequelize-slugify');

const Album = db.define('albums', {
  id: {
    type: Sequelize.DataTypes.UUID,
    defaultValue: function () {
      return uuidv4();
    },
    primaryKey: true
  },
  artist: {
    type: Sequelize.STRING,
    allowNull: false,
    validator: {
      notEmpty: true
    },
    defaultValue: ''
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
  tracks: {
    type: Sequelize.JSON,
    allowNull: false,
    get() {
      return JSON.parse(this.getDataValue('tracks'));
    },
    set(value) {
      const data = { value };
      return this.setDataValue('tracks', JSON.stringify(data));
    },
    defaultValue: JSON.stringify({ value: [] })
  },
  trackCount: {
    type: Sequelize.INTEGER,
    allowNull: false,
    validator: {
      notEmpty: true
    },
    defaultValue: 0
  },
  hashtags: {
    type: Sequelize.STRING,
    allowNull: false,
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
  },
  slug: {
    type: Sequelize.STRING,
    unique: true
  }
});

SequelizeSlugify.slugifyModel(Album, {
  source: ['title'],
  slugOptions: { lower: true },
  overwrite: true,
  column: 'slug'
});

module.exports = Album;
