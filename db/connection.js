const mysql = require('mysql2');

//config import
const { dbConnection } = require('../config/config');

const pool = mysql.createPool({
  host: dbConnection.host,
  user: dbConnection.user,
  password: dbConnection.password,
  database: dbConnection.database,
  multipleStatements: true,
  insecureAuth: true
});

module.exports = pool.promise();
