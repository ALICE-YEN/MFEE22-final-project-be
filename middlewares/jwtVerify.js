const jwt = require("jsonwebtoken");

let authenticateToken = function (req, res, next) {
  const token = req.headers.authorization.replace("Bearer ", "");
  console.log("token", req.headers.authorization);
  if (token === null) return res.sendStatus(401).json({ msg: "沒有找到token" });
  //returnMember怎麼讀出來
  //解碼token(驗證secret和檢查效期)
  jwt.verify(token, process.env.JWT_KEY, (error, decoded) => {
    if (error) {
      res.json({
        code: 1,
        msg: "token無效",
      });
    } else {
      //驗證通過
      req.decoded = decoded;
      next();
    }
  });
};
