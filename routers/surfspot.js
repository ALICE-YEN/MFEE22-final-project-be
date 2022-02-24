// 這裏  的 router
const express = require("express");
const connection = require("../utils/db");
const router = express.Router();

// 撈浪點介紹內容
router.get("/content", async (req, res, next) => {
  let result = await connection.execute("SELECT * FROM surfspot_list");
  let data = result[0];
  //   console.log(result);
  res.json(data);
});

// 撈海象
router.get("/sea", async (req, res, next) => {
  let result = await connection.execute("SELECT * FROM surfspot_sea");
  let data = result[0];
  //   console.log(result);
  res.json(data);
});

module.exports = router;
