const express = require("express");
const router = express.Router();
const connection = require("../utils/db");

// 傳送商品列表頁資料到前端
// http://localhost:3002/api/products
router.get("/", async (req, res, next) => {
  // 取得目前在哪個大分類
  let bigCats = Number(req.query.bigCats) || 0;
  console.log("bigCats", bigCats);

  // 取得目前在哪個小分類
  let smallCats = Number(req.query.smallCats) || 0;
  console.log("smallCats", smallCats);

  // 取得價格區間
  let priceLowest = Number(req.query.priceLowest) || "all";
  let priceHighest = Number(req.query.priceHighest) || "all";
  console.log("priceLowest", priceLowest);
  console.log("priceHighest", priceHighest);

  // 取得品牌
  let brand = Number(req.query.brand) || "all";
  console.log("brand", brand);

  // 沒有選擇大小分類
  if (bigCats === 0 && smallCats === 0) {
    // O: 價格區間篩選、品牌篩選
    if (priceLowest !== "all" && priceHighest !== "all" && brand !== "all") {
      let [data] = await connection.execute(
        "SELECT * FROM products WHERE price>=? AND price<=? AND brand_id=? GROUP BY product_group",
        [priceLowest, priceHighest, brand]
      );
      res.json(data);
      // O: 價格區間篩選 X: 品牌篩選
    } else if (
      priceLowest !== "all" &&
      priceHighest !== "all" &&
      brand === "all"
    ) {
      let [data] = await connection.execute(
        "SELECT * FROM products WHERE price>=? AND price<=? GROUP BY product_group",
        [priceLowest, priceHighest]
      );
      res.json(data);
      // O: 品牌篩選 X: 價格區間篩選
    } else if (
      priceLowest === "all" &&
      priceHighest === "all" &&
      brand !== "all"
    ) {
      let [data] = await connection.execute(
        "SELECT * FROM products WHERE brand_id=? GROUP BY product_group",
        [brand]
      );
      res.json(data);
      // X: 價格區間篩選、品牌篩選
    } else {
      let [data] = await connection.execute(
        "SELECT * FROM products GROUP BY product_group"
      );
      res.json(data);
    }
    // 選擇大分類
  } else if (bigCats !== 0 && smallCats === 0) {
    // O: 價格區間篩選、品牌篩選
    if (priceLowest !== "all" && priceHighest !== "all" && brand !== "all") {
      let [data] = await connection.execute(
        "SELECT * FROM products WHERE big_cat_id=? AND price>=? AND price<=? AND brand_id=? GROUP BY product_group",
        [bigCats, priceLowest, priceHighest, brand]
      );
      res.json(data);
    } // O: 價格區間篩選 X: 品牌篩選
    else if (
      priceLowest !== "all" &&
      priceHighest !== "all" &&
      brand === "all"
    ) {
      let [data] = await connection.execute(
        "SELECT * FROM products WHERE big_cat_id=? AND price>=? AND price<=? GROUP BY product_group",
        [bigCats, priceLowest, priceHighest]
      );
      res.json(data);
    } // O: 品牌篩選 X: 價格區間篩選
    else if (
      priceLowest === "all" &&
      priceHighest === "all" &&
      brand !== "all"
    ) {
      let [data] = await connection.execute(
        "SELECT * FROM products WHERE big_cat_id=? AND brand_id=? GROUP BY product_group",
        [bigCats, brand]
      );
      res.json(data);
      // X: 價格區間篩選、品牌篩選
    } else {
      let [data] = await connection.execute(
        "SELECT * FROM products WHERE big_cat_id=? GROUP BY product_group",
        [bigCats]
      );
      res.json(data);
    }
    // 選擇小分類
  } else if (smallCats !== 0) {
    // O: 價格區間篩選、品牌篩選
    if (priceLowest !== "all" && priceHighest !== "all" && brand !== "all") {
      let [data] = await connection.execute(
        "SELECT * FROM products WHERE small_cat_id=? AND price>=? AND price<=? AND brand_id=? GROUP BY product_group",
        [smallCats, priceLowest, priceHighest, brand]
      );
      res.json(data);
      // O: 價格區間篩選 X: 品牌篩選
    } else if (
      priceLowest !== "all" &&
      priceHighest !== "all" &&
      brand === "all"
    ) {
      let [data] = await connection.execute(
        "SELECT * FROM products WHERE small_cat_id=? AND price>=? AND price<=? GROUP BY product_group",
        [smallCats, priceLowest, priceHighest]
      );
      res.json(data);
      // O: 品牌篩選 X: 價格區間篩選
    } else if (
      priceLowest === "all" &&
      priceHighest === "all" &&
      brand !== "all"
    ) {
      let [data] = await connection.execute(
        "SELECT * FROM products WHERE small_cat_id=? AND brand_id=? GROUP BY product_group",
        [smallCats, brand]
      );
      res.json(data);
      // X: 價格區間篩選、品牌篩選
    } else {
      let [data] = await connection.execute(
        "SELECT * FROM products WHERE small_cat_id=? GROUP BY product_group",
        [smallCats]
      );
      res.json(data);
    }
  } else {
    let [data] = await connection.execute(
      "SELECT * FROM products GROUP BY product_group"
    );
    res.json(data);
  }
});

// 傳送商品細節頁資料到前端
// http://localhost:3002/api/products/LB-0001
router.get("/:product_group", async (req, res, next) => {
  let [data] = await connection.execute(
    "SELECT * FROM products WHERE product_group=?",
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
