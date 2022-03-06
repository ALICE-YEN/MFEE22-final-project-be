const express = require("express");
const { log } = require("npmlog");
const { body, validationResult } = require("express-validator");
const router = express.Router();
const connection = require("../utils/db");

//檢查格式
const orderRules = [
  body("convenient_store")
    .matches(/^((?!請選擇門市).)*$/gm)
    .withMessage("請選擇超商門市"),
];

// 前端傳送訂單到後端order_list、order-details
router.post("/", orderRules, async (req, res, next) => {
  console.log("order", req.body);
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
  let [result] = await connection.execute(
    "INSERT INTO order_list (member_id,amount,payment,payment_status,delivery,receiver,receiver_phone,address,convenient_store,status) VALUES (?,?,?,?,?,?,?,?,?,?)",
    [
      req.body.member_id,
      req.body.amount,
      req.body.payment,
      req.body.payment_status,
      req.body.delivery,
      req.body.receiver,
      req.body.receiver_phone,
      req.body.address,
      req.body.convenient_store,
      req.body.status,
    ]
  );

  for (var i = 0; i < req.body.order_details.length; i++) {
    let [resultDetail] = await connection.execute(
      "INSERT INTO order_details (order_id,product_no,quantity,style) VALUES (?,?,?,?)",
      [
        result.insertId,
        req.body.order_details[i].product_no,
        req.body.order_details[i].count,
        req.body.order_details[i].style,
      ]
    );
    // console.log("order_details", req.body.order_details);
    // console.log("order_details[0]", req.body.order_details[0]);
    // console.log("product_no", req.body.order_details[0].product_no);
  }

  res.json({ message: "ok" });
});

module.exports = router;
