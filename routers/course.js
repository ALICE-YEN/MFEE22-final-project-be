const express = require("express");
const router = express.Router();
const connection = require("../utils/db");

// 上課地點北部/東北部
// http://localhost:3002/api/course/courseSpot
router.get("/courseSpot/north", async (req, res, next) => {
  let [data] = await connection.execute(
    "SELECT * FROM course_spot WHERE area=?",
    ["北部"]
  );
  console.log(data);
  res.json(data);
});

// 上課地點東部/西部/南部
// http://localhost:3002/api/course/courseSpot/others
router.get("/courseSpot/others", async (req, res, next) => {
  let [data] = await connection.execute(
    "SELECT * FROM course_spot WHERE area!=?",
    ["北部"]
  );
  console.log(data);
  res.json(data);
});

// 課程報名訂單存進資料庫
// http://localhost:3002/api/course/courseOrder
router.post("/courseOrder", async (req, res, next) => {
  let [data] = await connection.execute(
    "INSERT INTO course_order(course,courseDate,coursePrice,courseSpot,courseTime,name,pid,sex,bdDay,phone,guardian) VALUES(?,?,?,?,?,?,?,?,?,?,?) ",
    [
      req.body[0].course,
      req.body[0].courseDate,
      req.body[0].coursePrice,
      req.body[0].courseSpot,
      req.body[0].courseTime,
      req.body[1].name,
      req.body[1].pid,
      req.body[1].sex,
      req.body[1].bdDay,
      req.body[1].phone,
      req.body[1].guardian,
    ]
  );
  console.log(data);
  res.json({
    message: "ok收到課程報名訂單",
  });
});

module.exports = router;
