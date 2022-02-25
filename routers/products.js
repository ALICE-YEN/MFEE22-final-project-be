const express = require("express");
const router = express.Router();
const connection = require("../utils/db");

const { checkLogin } = require("../middlewares/auth");
router.use(checkLogin);

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

module.exports = router;
