const express = require("express");
const router = express.Router();
const connection = require("../utils/db");

// RESTful API 的列表
// 首頁路由 (http://localhost:3002/api/stock)，不用stocks違反RESTful API設計方式，但是方便
router.get("/", async (req, res, next) => {
  let [data, fields] = await connection.execute("SELECT * FROM products");
  console.log(data);

  res.json(data);
});
