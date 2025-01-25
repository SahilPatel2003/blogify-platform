const mysql = require('mysql2/promise');
require('dotenv').config();


// Create connection pool
const pool = mysql.createPool({
  connectionLimit: 10,
  host: 'localhost',
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: 'Rapid_page_builder'
});

module.exports=pool;
