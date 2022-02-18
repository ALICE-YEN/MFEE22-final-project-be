const express = require("express");
const router = express.Router();
const connection = require("../utils/db");

// RESTful API 的列表
// http://localhost:3002/api/products
router.get("/", async (req, res, next) => {
  let [data] = await connection.execute("SELECT * FROM products");
  console.log(data);
  res.json(data);
});

module.exports = router;
