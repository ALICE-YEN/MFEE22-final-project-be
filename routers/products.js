const express = require("express");
const router = express.Router();
const connection = require("../utils/db");

// RESTful API 的列表
// http://localhost:3002/api/products
router.get("/", async (req, res, next) => {
  let [data] = await connection.execute(
    "SELECT * FROM products GROUP BY left(product_no,7)"
  );
  console.log(data);
  res.json(data);
});

// 從前端拿product_group
// router.get("/:product_group", async (req, res, next) => {
//   // console.log(req.responseFe.data);
//   // res.json(req.responseFe.data);
// });

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
