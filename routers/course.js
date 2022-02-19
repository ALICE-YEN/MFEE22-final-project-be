const express = require("express");
const router = express.Router();
const connection = require("../utils/db");

// RESTful API 的列表
// http://localhost:3002/api/course
router.post("/", async (req, res, next) => {
  //   let [data] = await connection.execute("SELECT * FROM ");
  console.log(req.body);
  res.json({
    message: "ok收到課程報名訂單",
  });
});

module.exports = router;
