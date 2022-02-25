const express = require("express");
const router = express.Router();
const connection = require("../utils/db");

// 傳送商品列表頁資料到前端
// http://localhost:3002/api/products
router.get("/", async (req, res, next) => {
  let [data] = await connection.execute(
    "SELECT * FROM products GROUP BY left(product_no,7)"
  );
  console.log(data);
  res.json(data);
});

// 傳送商品細節頁資料到前端
// http://localhost:3002/api/products/LB-0001
router.get("/:product_group", async (req, res, next) => {
  let [data] = await connection.execute(
    "SELECT * FROM products WHERE product_group = ?",
    [req.params.product_group]
  );
  console.log(data);
  res.json(data);
});

// 前端傳送訂單到後端
router.post("/cart", async (req, res, next) => {
  let [result] = await connection.execute(
    "INSERT INTO order_list (member_id,amount,payment,payment_status,delivery,receiver,receiver_phone,address,convenient_store,status,order_time) VALUES (?,?,?,?,?,?,?,?,?,?,?)",
    [
      req.body.member_id,
      req.body.amount,
      req.body.payment,
      req.body.payment_status,
      req.body.delivery,
      req.body.receiver,
      req.body.receiverPhone,
      req.body.address,
      req.body.convenient_store,
      req.body.status,
      req.body.order_time,
    ]
  );
  console.log(result);

  res.json({ message: "ok" });
});

module.exports = router;
