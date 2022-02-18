const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const connection = require("../utlis/db");
const argon2 = require("argon2");

//檢查格式
const registerRules = [
  body("email").isEmail().withMessage("Email欄位請填寫正確格式"),
  body("name")
    .trim()
    .isLength({ min: 3, max: 15 })
    .withMessage("姓名稱需 3 ~ 15 字元"),
  // .notEmpty()
  // .withMessage('姓名或密碼不得為空'),
  body("password")
    .matches(/\d/)
    .withMessage("請輸入數字")
    .isLength({ min: 5 })
    .withMessage("密碼長度最少為 5"),
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
  let hashPwd = await argon2.hash("password");
  //存到資料庫
  let [result] = await connection.execute(
    "INSERT INTO member (member_email,member_name,member_password) VALUES(?,?,?)",
    [req.body.email, req.body.name, hashPwd]
  );
  console.log(result);
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
      msg: "帳號或密碼錯誤，沒有資料",
    });
  }
  //把會員資料從陣列中拿出來 mysql2套件轉出資料為陣列
  let member = members[0];

  // 如果有這個帳號，再去比對密碼
  // let result = await argon2.verify(member.member_password, req.body.password);
  // console.log("password比對結果:", result);
  let result = true;
  if (!result) {
    // 如果比對失敗
    return res.status(400).send({
      code: "33007",
      msg: "帳號或密碼錯誤",
    });
  }

  //記錄在session
  let returnMember = {
    id: member.member_id,
    account: member.member_account,
    name: member.member_name,
  };
  //寫session 自訂member參數
  req.session.member = returnMember;
  //JWT
  res.json({
    code: "0", //成功
    data: returnMember,
  });

  console.log(req.session.member.id);
});

// router.get("/checklogin", async (req, res, next) => {
//   if (req.session.member) {
//     res.json({ msg: "login" });
//   } else {
//     res.json({ msg: "logout" });
//   }
// });
// router.get("/logout", (req, res, next) => {
//   req.session.member = null;
//   res.sendStatus(202);
// });

module.exports = router;
