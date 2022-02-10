const mysql = require('mysql2');

//config import
const { dbConnection } = require('../config/config');

const mysqlConnection = mysql.createConnection({
  host: dbConnection.host,
  user: dbConnection.user,
  password: dbConnection.password,
  database: dbConnection.database,
  multipleStatements: true,
  insecureAuth: true
});

mysqlConnection.connect((err) => {
  if (!err) {
    {
      console.log('Database connected');
    }
  } else {
    {
      console.log('error' + err.message);
    }
  }
});

module.exports = mysqlConnection;
