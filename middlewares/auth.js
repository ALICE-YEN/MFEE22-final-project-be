//auth middleware

let checkLogin = function (req, res, next) {
  if (req.session.member) {
    res.json(req.session.member);
  } else {
    res.json({ msg: "尚未登入middleware" });
  }
};

module.exports = { checkLogin };
