const Sequelize = require('sequelize');
const { dbConnection } = require('../config/config');

module.exports = new Sequelize(
  dbConnection.database,
  dbConnection.user,
  dbConnection.password,
  {
    host: 'localhost',
    dialect: 'mysql',

    pool: {
      max: 5,
      min: 0,
      idle: 10000
    }
  }
);
