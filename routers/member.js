// 這裏 member 的 router
const express = require("express");
const router = express.Router();
// const memberController = require("../controllers/member");
const connection = require("../utils/db");

// RESTful API 的列表
// router.get("/api/member", memberController.getMemberOrder);

// router.get("/api/member/:orderId", memberController.getAll);

router.get("/", async (req, res, next) => {
  let [data] = await connection.execute("SELECT * FROM order_list");
  console.log(data);
  res.json(data);
});

router.get("/:orderId", async (req, res, next) => {
  let [data] = await connection.execute(
    // "SELECT * FROM order_details WHERE id=?",
    "SELECT * FROM ((order_details INNER JOIN products ON order_details.product_id = products.product_id) INNER JOIN order_list ON order_details.order_id = order_list.id) INNER JOIN member ON order_list.member_id = member.member_id WHERE order_id=?",
    [req.params.orderId]
  );
  res.json(data);
});

module.exports = router;
