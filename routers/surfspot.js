// 這裏  的 router
const express = require("express");
const connection = require("../utils/db");
const router = express.Router();

// 撈浪點介紹內容
router.get("/content", async (req, res, next) => {
  let result = await connection.execute("SELECT * FROM surfspot_list");
  let data = result[0];
  // console.log(result);
  res.json(data);
});

// 撈浪點氣象資訊
router.get("/wave-info", async (req, res, next) => {
  let result4 = await connection.execute(
    "SELECT surfspot_sunset.id,surfspot_sunset.sunsetTime, surfspot_uv.id, surfspot_uv.uv, surfspot_sea.id, surfspot_sea.windScale, surfspot_sea.windDirection, surfspot_sea.windSpeed, surfspot_sea.temperature, surfspot_sea.seaTemperature, surfspot_tide.id, surfspot_tide.fullTime1, surfspot_tide.fullTime2, surfspot_tide.dryTime1, surfspot_tide.dryTime2 FROM surfspot_sunset INNER JOIN surfspot_uv ON surfspot_sunset.id=surfspot_uv.id INNER JOIN surfspot_sea ON surfspot_sunset.id=surfspot_sea.id INNER JOIN surfspot_tide ON surfspot_sunset.id=surfspot_tide.id"
  );
  let data4 = result4[0];
  // console.log(result4);
  res.json(data4);
});

module.exports = router;
