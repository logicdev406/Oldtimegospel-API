const db = require('../db/connection');
const Sequelize = require('sequelize');
const { v4: uuidv4 } = require('uuid');

const User = db.define('users', {
  id: {
    type: Sequelize.UUIDV4,
    allowNull: false,
    validator: {
      notEmpty: true
    },
    defaultValue: uuidv4(),
    primaryKey: true
  },
  firstName: {
    type: Sequelize.STRING,
    allowNull: false,
    validator: {
      notEmpty: true
    }
  },
  lastName: {
    type: Sequelize.STRING,
    allowNull: false,
    validator: {
      notEmpty: true
    }
  },
  role: {
    type: Sequelize.STRING,
    allowNull: false,
    validator: {
      notEmpty: true
    }
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    validator: {
      notEmpty: true
    }
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
    validator: {
      notEmpty: true
    }
  }
});

module.exports = User;
