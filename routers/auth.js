const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const connection = require("../utils/db");
const argon2 = require("argon2");
const { sendEmail } = require("../nodemailer");
// const { googlelogin } = require("../controllers/googlelogin");

//檢查格式
const registerRules = [
  body("email")
    .notEmpty()
    .withMessage("Email不得為空")
    .isEmail()
    .withMessage("Email欄位請填寫正確格式"),
  body("name")
    .trim()
    .notEmpty()
    .withMessage("姓名不得為空")
    .isLength({ min: 3, max: 15 })
    .withMessage("姓名需 3 ~ 15 字元"),
  //
  body("password")
    .trim()
    .notEmpty()
    .withMessage("密碼不得為空")
    .isLength({ min: 5 })
    .withMessage("密碼長度最少為 5"),
  body("agree").notEmpty().withMessage("我同意不得為空"),
];

//api/auth/register
router.post("/register", registerRules, async (req, res, next) => {
  console.log(req.body);
  //拿到驗證結果
  const validateResult = validationResult(req);
  if (!validateResult.isEmpty()) {
    let error = validateResult.array();
    console.log("驗證結果", error);
    return res.status(400).json({
      code: "33001",
      msg: error[0].msg,
    });
  }
  //檢查email是否已註冊
  let [members] = await connection.execute(
    "SELECT * FROM member WHERE member_email=?",
    [req.body.email]
  );
  console.log(members);
  if (members.length > 0) {
    return res.status(400).send({
      code: "33005",
      msg: "此帳號已註冊",
    });
  }
  //雜湊密碼
  let hashPwd = await argon2.hash(req.body.password);
  //存到資料庫
  let [result] = await connection.execute(
    "INSERT INTO member (member_email,member_name,member_password) VALUES(?,?,?)",
    [req.body.email, req.body.name, hashPwd]
  );
  console.log(result);
  //nodemailer發送
  sendEmail(req.body.email);

  res.json({ message: "ok" });
});

//api/auth/login
router.post("/login", async (req, res, next) => {
  console.log(req.body); //從前端傳送

  //確認是否有此帳號
  let [members] = await connection.execute(
    "SELECT * FROM member WHERE member_email=?",
    [req.body.email]
  );
  // console.log("資料庫email比對", members);
  if (members.length === 0) {
    return res.status(400).send({
      code: "33006",
      msg: "無此帳號",
    });
  }
  //把會員資料從陣列中拿出來 mysql2套件轉出資料為陣列
  let member = members[0];

  // 如果有這個帳號，再去比對密碼
  let result = await argon2.verify(member.member_password, req.body.password);
  // console.log("password比對結果:", result);

  if (!result) {
    // 如果比對失敗
    return res.status(400).send({
      code: "33007",
      msg: "帳號或密碼錯誤",
    });
  }

  //記錄在session
  let returnMember = {
    member_id: member.member_id,
    account: member.member_account,
    name: member.member_name,
    email: member.member_email,
    phone: member.member_phone,
    address: member.member_address,
    photo: member.filename,
    // password: member.member_password,
    receiver_name: member.receiver_name,
    receiver_phone: member.receiver_phone,
    receiver_address: member.receiver_address,
    remark: member.remark,
  };

  //寫session 自訂member參數
  req.session.member = returnMember;

  //api/auth/login/googlelogin
  // router.post("/googlelogin", googlelogin);
  res.json({
    code: "0", //成功
    data: returnMember,
    // returnOrderList, //登入成功後的object
  });
  console.log(req.session.member.id);
});

router.get("/checklogin", async (req, res, next) => {
  if (req.session.member) {
    let [member] = await connection.execute(
      `SELECT * FROM member where member_id = ${req.session.member.member_id}`
    );
    res.json(member[0]);
    // next(); //404 not found
  } else {
    res.status(400).json({ msg: "尚未登入" });
  }
});
router.get("/logout", (req, res, next) => {
  req.session.member = null;
  res.sendStatus(202);
});
module.exports = router;
