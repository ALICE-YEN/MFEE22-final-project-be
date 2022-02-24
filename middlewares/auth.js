//auth middleware

let checkLogin = function (req, res, next) {
  if (req.session.member) {
    res.json({ msg: "login" });
  } else {
    // res.json({ msg: "尚未登入" });
  }
};

module.exports = { checkLogin };
