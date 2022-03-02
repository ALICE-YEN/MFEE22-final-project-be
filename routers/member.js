// 這裏 member 的 router
const express = require("express");
const router = express.Router();
// const memberController = require("../controllers/member");
const connection = require("../utils/db");
const argon2 = require("argon2");
const path = require("path");

const multer = require("multer");

// RESTful API 的列表
// router.get("/api/member", memberController.getMemberList);
router.get("/${auth.id}", async (req, res, next) => {
  let [member] = await connection.execute("SELECT * FROM member");
  // console.log(member);
  res.json(member);
});

// router.get("/api/member/member-order", memberController.getMemberOrderList);
router.get("/member-order", async (req, res, next) => {
  let [member] = await connection.execute(
    `SELECT * FROM order_list ORDER BY order_time DESC WHERE member_id = ${req.params.memberId} AND valid = 0`,
    [req.params.memberId]
  );
  res.json(member);
  // console.log(member);
});

router.post("/order/:orderId/delete", async (req, res, next) => {
  try {
    let [result] = await connection.execute(
      `UPDATE order_list SET valid = 2, status = '訂單已取消' WHERE id = ${req.params.orderId}`
    );

    res.json({ isDeleted: result.changedRows > 0 });
  } catch (error) {
    res.json({ message: "資料刪除失敗" });
  }
});

// // router.get("/api/member/member-courseorder/:id", memberController.getMemberCourseOrderDetails);
router.get("/member-courseorderdetails/:id", async (req, res, next) => {
  let [data] = await connection.execute(
    // "SELECT * FROM order_details WHERE id=?",
    "SELECT * FROM course_order JOIN member ON course_order.member_id = member.member_id WHERE course_order.id = ?",
    [req.params.id]
  );
  res.json(data);
});

router.post("/member-courseorder/:id/delete", async (req, res, next) => {
  try {
    let [result] = await connection.execute(
      `UPDATE course_order SET valid = 1 WHERE id = ${req.params.id}`
    );

    res.json({ isDeleted: result.changedRows > 0 });
  } catch (error) {
    res.json({ message: "資料刪除失敗" });
  }
});

router.post("/member-order/:id/delete", async (req, res, next) => {
  try {
    let [result] = await connection.execute(
      `UPDATE order_list SET valid = 1 WHERE id = ${req.params.id}`
    );

    res.json({ isDeleted: result.changedRows > 0 });
  } catch (error) {
    res.json({ message: "資料刪除失敗" });
  }
});

// router.get("/api/member/member-courseorder", memberController.getMemberCourseOrderList);
router.get("/member-courseorder/:member_id", async (req, res, next) => {
  let [data] = await connection.execute(
    `SELECT * FROM course_order JOIN member ON course_order.member_id = member.member_id WHERE course_order.member_id = ? AND valid = 0 GROUP BY course_order.id ORDER BY course_order.courseDate DESC`,
    [req.params.member_id]
  );
  // console.log(data);
  res.json(data);
});

// amount router.get("/api/member/:memberId", memberController.getMember);
router.get("/:memberId", async (req, res, next) => {
  let [member] = await connection.execute(
    "SELECT a.*, SUM(b.amount) amount FROM member a JOIN order_list b ON a.member_id = b.member_id GROUP BY a.member_id HAVING a.member_id = ?",
    [req.params.memberId]
  );
  res.json(member);
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "..", "public", "uploads", "member"));
  },
  filename: function (req, file, cb) {
    console.log("multer-filename", file);
    // 副檔名用.分割成陣列並pop那最後一個 length-1也可以
    const ext = file.originalname.split(".").pop();
    cb(null, `member-${Date.now()}.${ext}`);
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

router.post("/:memberId", uploader.single("photo"), async (req, res, next) => {
  try {
    const member = JSON.parse(req.body.data);
    console.log(member);

    let filename = req.file ? "/uploads/member/" + req.file.filename : "";
    console.log("filename!");
    console.log(filename);
    let password = await argon2.hash(member.password);
    if (filename) {
      let [result] = await connection.execute(
        `UPDATE member set member_photo='${filename}', member_name='${member.member_name}', member_email='${member.member_email}', member_password='${password}', member_phone='${member.member_phone}', member_address='${member.member_address}', receiver_name='${member.receiver_name}', receiver_phone='${member.receiver_phone}', receiver_address='${member.receiver_address}', remark='${member.remark}' WHERE member_id = ${req.params.memberId}`
      );
    } else {
      let [result] = await connection.execute(
        `UPDATE member set member_name='${member.member_name}', member_email='${member.member_email}', member_password='${password}', member_phone='${member.member_phone}', member_address='${member.member_address}', receiver_name='${member.receiver_name}', receiver_phone='${member.receiver_phone}', receiver_address='${member.receiver_address}', remark='${member.remark}' WHERE member_id = ${req.params.memberId}`
      );
      res.json({ isChanged: result.changedRows > 0 });
    }
  } catch (error) {
    console.log(error);
    res.json({ message: "資料儲存失敗" }, 400);
  }
});

// router.get("/api/member/member-order/:orderId", memberController.getMemberOrderList);
router.get("/member-order/:member_id", async (req, res, next) => {
  let [data] = await connection.execute(
    // "SELECT * FROM order_details WHERE id=?",
    "SELECT * FROM ( ( order_details INNER JOIN products ON order_details.product_id = products.product_id ) INNER JOIN order_list ON order_details.order_id = order_list.id ) INNER JOIN member ON order_list.member_id = member.member_id WHERE member.member_id = ? AND valid = 0 or valid = 2 GROUP BY order_list.id ORDER BY order_list.order_time DESC",
    [req.params.member_id]
  );
  res.json(data);
});

// router.get("/api/member/member-order/:orderId", memberController.getMemberOrderDetails);
router.get("/member-orderdetails/:order_id", async (req, res, next) => {
  let [data] = await connection.execute(
    // "SELECT * FROM order_details WHERE id=?",
    "SELECT * FROM ( ( order_details INNER JOIN products ON order_details.product_id = products.product_id ) INNER JOIN order_list ON order_details.order_id = order_list.id ) INNER JOIN member ON order_list.member_id = member.member_id WHERE order_list.id = ? ORDER BY order_list.order_time DESC",
    [req.params.order_id]
  );
  res.json(data);
});

module.exports = router;
