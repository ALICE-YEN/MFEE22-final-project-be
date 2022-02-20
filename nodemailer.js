const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
});

function sendEmail(email) {
  const options = {
    from: process.env.MAIL_USER,
    to: email,
    subject: "Funwave 帳號註冊成功",
    html: "<h2>恭喜成為 Funwave 會員</h2><a href='http://localhost:3000/login'><h2>點擊登入</h2></a>",
  };

  transporter.sendMail(options, function (err, info) {
    if (err) {
      console.log(err);
      return;
    }
    console.log("信件發送:", info.response);
  });
}
module.exports = { sendEmail };
