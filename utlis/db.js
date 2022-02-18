<<<<<<< HEAD
const mysql = require("mysql2");
require("dotenv").config();

=======
// npm i mysql2
const mysql = require('mysql2');

// 把 createConnection -> createPool
>>>>>>> 0a6d95b1a1176767b5643d278d5d6e719a06b14d
let pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
<<<<<<< HEAD
  //連線上限
  connectionLimit: 10,
  dateStrings: true,
  //   連接超時
  // connectTimeout:
});

//傳回pool.promise()
=======
  // 加上連線數限制
  connectionLimit: 10,
  dateStrings: true,
});

// 傳回 pool.promise()
>>>>>>> 0a6d95b1a1176767b5643d278d5d6e719a06b14d
module.exports = pool.promise();
