const express = require("express");
const router = express.Router();
const connection = require("../utils/db");
//推薦商品
router.get("/", async (req, res, next) => {
  let [data] = await connection.execute(
    "SELECT * FROM products WHERE small_cat_id=? ORDER BY rand() LIMIT 3",
    [req.query.rec]
  );
  //   console.log("推薦", data);
  res.json(data);
});

module.exports = router;
