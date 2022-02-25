const express = require("express");
const router = express.Router();
const connection = require("../utils/db");
const path = require("path");

// 取上課地點北部/東北部圖片
// http://localhost:3002/api/course/courseSpot
router.get("/courseSpot/north", async (req, res, next) => {
  let [north] = await connection.execute(
    "SELECT * FROM course_spot WHERE area=?",
    ["北部"]
  );
  // console.log(north);
  res.json(north);
});

// 取上課地點東部/西部/南部圖片
// http://localhost:3002/api/course/courseSpot/others
router.get("/courseSpot/others", async (req, res, next) => {
  let [otherSpot] = await connection.execute(
    "SELECT * FROM course_spot WHERE area!=?",
    ["北部"]
  );
  // console.log(data);
  res.json(otherSpot);
});

// 課程報名訂單存進資料庫
// http://localhost:3002/api/course/courseOrder
router.post("/courseOrder", async (req, res, next) => {
  let [data] = await connection.execute(
    "INSERT INTO course_order(course,courseTime,courseSpot,courseDate,coursePrice,amount,peopleNum,payMethod,name,email,sex,note,phone) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?) ",
    [
      req.body[0].course,
      req.body[0].courseTime,
      req.body[0].courseSpot,
      req.body[0].courseDate,
      req.body[0].coursePrice,
      req.body[0].amount,
      req.body[0].peopleNum,
      req.body[0].payMethod,
      req.body[1].name,
      req.body[1].email,
      req.body[1].sex,
      req.body[1].note,
      req.body[1].phone,
    ]
  );
  // console.log(req.body[0]);
  // console.log(req.body[1]);

  res.json({
    message: "ok收到課程報名訂單",
  });
});

// 處理圖片用還要記得引用path
// 圖片設置要存去哪
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "..", "public", "uploads", "course"));
  },
  filename: function (req, file, cb) {
    console.log("multer-filename", file);
    // 副檔名用.分割成陣列並pop那最後一個 length-1也可以
    const ext = file.originalname.split(".").pop();
    cb(null, `course-evaluate-${Date.now()}.${ext}`);
  },
});

//上傳器設置圖片格式
const uploader = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    console.log("file.mimetype", file.mimetype);
    if (
      file.mimetype !== "image/jpeg" &&
      file.mimetype !== "image/jpg" &&
      file.mimetype !== "image/png"
    ) {
      cb(new Error("不接受的檔案型態"), false);
    } else {
      cb(null, true);
    }
  },
  // 檔案尺寸
  limits: {
    // 1K: 1024
    fileSize: 200 * 1024,
  },
});

// 存課程評價留言+圖片(較複雜)
// 把上傳器放過來(single單一圖片)
// TODO:若要多張圖片
// http://localhost:3002/api/course/courseEvaluate
router.post(
  "/courseEvaluate",
  uploader.single("photo"),
  async (req, res, next) => {
    // 如果有上傳就給它網址沒有就空
    let filename = req.file ? "/uploads/course/" + req.file.filename : "";

    let [courseEvaluate] = await connection.execute(
      "INSERT INTO course_evaluate (name,message,rating,date,photo)VALUES(?,?,?,?,?) ",
      [req.body.name, req.body.msg, req.body.rating, req.body.date, filename]
    );

    res.json({
      message: "收到評價留言",
    });
  }
);

// 取課程評價留言
// http://localhost:3002/api/course/course-evaluate
router.get("/course-evaluate", async (req, res, next) => {
  let [evaluate] = await connection.execute("SELECT * FROM course_evaluate");
  console.log(evaluate);
  res.json(evaluate);
});

module.exports = router;
