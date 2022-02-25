//auth middleware

let checkLogin = function (req, res, next) {
  if (req.session.member) {
    //res.json(req.session.member);
    next();
  } else {
    res.json({ msg: "尚未登入" });
  }
};

module.exports = { checkLogin };
