const mysql = require("mysql2");
require("dotenv").config();

let pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  //連線上限
  connectionLimit: 10,
  dateStrings: true,
  //   連接超時
  // connectTimeout:
});

//傳回pool.promise()
module.exports = pool.promise();
