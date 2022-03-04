const express = require("express");
const router = express.Router();
const connection = require("../utils/db");

router.get("/", async (req, res, next) => {
  let wishList = req.query.collectdata; // FB-0001,FB-0002,FB-0003
  const operator = (string) => {
    var data = "";
    var array = string.split(","); // [FB-0001,FB-0002,FB-0003]
    for (var i = 0; i < array.length; i++) {
      data = data + `product_group = "${array[i]}" OR `;
      console.log("data", data);
    }
    data = data.substring(0, data.length - 3);
    // "FB-0001" OR product_group OR=> "FB-0001" OR product_group
    return data;
  };

  let wishDone = operator(wishList);
  // console.log("wishDone", wishDone);

  let [data] = await connection.execute(
    `SELECT * FROM products WHERE ${wishDone} GROUP BY product_group`
  );
  console.log("collect", data);
  res.json(data);
});
module.exports = router;

// ["FB-0005","FB-0003","FB-0004","FI-0003","FB-0002","FB-0001"]
