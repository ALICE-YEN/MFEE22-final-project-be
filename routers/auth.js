const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const connection = require("../utils/db");
const argon2 = require("argon2");
const { sendEmail } = require("../nodemailer");
const jwt = require("jsonwebtoken");
require("dotenv").config();
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

// decoded.PAYLOAD = {
//   id: 18,
//   account: "12345",
//   name: "123",
//   email: "123@test.com",
//   phone: "0933333333",
//   address: null,
//   iat: 1646055290,
//   exp: 1646141690,
// };

// //(user)帶入的參數改什麼
// const generateAccessToken = (user) => {
//   return jwt.sign(returnMember, process.env.JWT_KEY, {
//     expiresIn: "1 day",
//   });
// };

// const generateRefreshToken = (user) => {
//   return jwt.sign(returnMember, process.env.JWT_REFRESH_KEY);
// };

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
  // //寫session 自訂member參數
  // req.session.member = returnMember;

  // res.json({
  //   code: "0", //成功
  //   data: returnMember, //登入成功後的object
  // });
  // console.log(req.session.member.id);

  //jwt
  // 使用者資料存入Token，設定 Token 時效為一天，並帶入自訂密鑰（JWT_KEY）
  const token = jwt.sign(returnMember, process.env.JWT_KEY, {
    expiresIn: "1 day",
  });
  res.json({
    code: "0",
    msg: "登入成功",
    token: token, //token碼
    data: returnMember,
  });
});

//api/auth/jwt-verify
router.post("/jwt-verify", (req, res, next) => {
  // 從前端請求的 header 取得和擷取 JWT
  //JWT使用Bearer 開頭的 Authorization
  const token = req.headers.authorization.replace("Bearer ", "");
  console.log("token:", token);
  if (token === null) return res.sendStatus(401).json({ msg: "沒有找到token" });
  //returnMember怎麼讀出來
  //解碼token(驗證secret和檢查效期)
  const decoded = jwt.verify(token, process.env.JWT_KEY);
  console.log("decoded:", decoded);
});

//api/auth/refresh
// let refreshTokens = [];
// router.post("/refresh", (req, res, next) => {
//   //從前端拿取更新token

//   //沒有token或沒有驗證報錯
//   if (!req.body.token) return res.status(401).json({ msg: "沒有token" });
//   if (!refreshTokens.includes(req.body.token)) {
//     return res.status(403).json({ msg: "Refresh token 沒被驗證" });
//   }
//   jwt.verify(
//     req.body.token,
//     process.env.JWT_REFRESH_KEY,
//     (err, returnMember) => {
//       err && console.log(err);
//       refreshTokens = refreshTokens.filter((token) => token !== req.body.token);

//       //都沒問題，創建新的 token、refresh token送給前端
//       const newAccessToken = generateAccessToken(user);
//       const newRefreshToken = generateRefreshToken(user);
//       res.status(200).json({
//         accessToken: newAccessToken,
//         refreshToken: newRefreshToken,
//       });
//     }
//   );
// });

//checklogin怎麼判斷
router.get("/checklogin", (req, res, next) => {
  console.log(req.query.token); //undefined
  console.log(req.body.token); //undefined
  if (req.query.token) {
    res.json({
      msg: "已登入",
    });
  } else {
    res.status(400).json({ msg: "尚未登入" });
  }
});
// router.get("/logout", (req, res, next) => {
//   req.session.member = null;
//   res.sendStatus(202);
// });

router.get("/logout", (req, res, next) => {
  // refreshTokens = refreshTokens.filter((token) => token !== req.body.token);
  console.log(req.body.token); //undefined
  req.body.token = null;
  res.sendStatus(202);
});

module.exports = router;
