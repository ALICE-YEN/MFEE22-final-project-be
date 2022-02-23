//api/auth/login/googlelogin
const { OAuth2Client } = require("google-auth-library");
require("dotenv").config();
const connection = require("../utils/db");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

let googlelogin = async (req, res, next) => {
  const { tokenId } = req.body;

  //驗證 id_token 是否正確
  const ticket = await client.verifyIdToken({
    idToken: tokenId,
    audience: "process.env.GOOGLE_CLIENT_ID",
  });

  const { email, name, picture } = ticket.getPayload();
  // 判斷帳號是否存在
  if (email) {
  }

  //寫到資料庫
  let [result] = await connection.execute(
    "INSERT INTO member (member_email,member_name,member_password) VALUES(?,?,?)",
    [email, name, picture]
  );
  console.log(result);

  res.status(201);
  res.json({ email, name, picture });

  console.log();
};

module.exports = { googlelogin };
