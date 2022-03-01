const express = require("express");
const router = express.Router();
const connection = require("../utils/db");

// 傳送商品列表頁資料到前端
// http://localhost:3002/api/products
router.get("/", async (req, res, next) => {
  // 取得目前在哪個大小分類
  let bigCats = req.query.bigCats || 1;
  console.log("bigCats", bigCats);

  let [data] = await connection.execute(
    "SELECT * FROM products WHERE big_cat_id=? GROUP BY product_group",
    [bigCats]
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

// 前端傳送訂單到後端order_list、order-details
router.post("/order", async (req, res, next) => {
  console.log("order", req.body);
  let [result] = await connection.execute(
    "INSERT INTO order_list (member_id,amount,payment,payment_status,delivery,receiver,receiver_phone,address,convenient_store,status,order_time) VALUES (?,?,?,?,?,?,?,?,?,?,?)",
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
      req.body.order_time,
    ]
  );

  for (var i = 0; i < req.body.order_details.length; i++) {
    let [resultDetail] = await connection.execute(
      "INSERT INTO order_details (order_id,product_no,quantity) VALUES (?,?,?)",
      [
        result.insertId,
        req.body.order_details[i].product_no,
        req.body.order_details[i].count,
      ]
    );
    // console.log("order_details", req.body.order_details);
    // console.log("order_details[0]", req.body.order_details[0]);
    // console.log("product_no", req.body.order_details[0].product_no);
  }

  res.json({ message: "ok" });
});

module.exports = router;
