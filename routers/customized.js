const express = require("express");
const router = express.Router();
const connection = require("../utils/db");

router.get("/", async (req, res, next) => {
  let [data] = await connection.execute("SELECT * FROM customized_pattern ");
  console.log(data);
  res.json(data);
});

module.exports = router;
