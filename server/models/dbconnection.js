var mysql = require('mysql');
var mysqlConnection  = mysql.createPool({
  connectionLimit : 1000,
  host            : process.env.DB_HOST,
  user            : process.env.DB_USERNAME,
  password        : process.env.DB_PASSWORD,
  database        : process.env.DB_NAME
});
mysqlConnection.getConnection(function(err, connection) {
    if (err) throw err; // not connected!
  });

module.exports = mysqlConnection;