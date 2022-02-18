// auth middleware

let checkLogin = function (req, res, next) {
  // req.session.member = returnMember
  if (req.session.member) {
    // 表示登入過
    next();
  } else {
    // 表示尚未登入
    res.status(400).json({ code: "11111", msg: "尚未登入" });
  }
};

module.exports = { checkLogin };
