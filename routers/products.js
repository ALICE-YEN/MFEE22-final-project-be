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

  // 取得顏色(多選)
  let color = req.query.color || "all"; // false代表沒有篩選任何顏色
  let color1 = req.query.color1 || "all";
  let color2 = req.query.color2 || "all";
  let color3 = req.query.color3 || "all";
  let color4 = req.query.color4 || "all";
  let color5 = req.query.color5 || "all";
  let color6 = req.query.color6 || "all";
  let color7 = req.query.color7 || "all";
  let color8 = req.query.color8 || "all";
  let color9 = req.query.color9 || "all";
  console.log("color", color);
  console.log("color1", color1);
  console.log("color2", color2);
  console.log("color3", color3);
  console.log("color4", color4);
  console.log("color5", color5);
  console.log("color6", color6);
  console.log("color7", color7);
  console.log("color8", color8);
  console.log("color9", color9);

  // 取得適用衝浪舵類型(多選)
  let fin = req.query.fin || "all"; // false代表沒有篩選任何顏色
  let fin1 = req.query.fin1 || "all";
  let fin2 = req.query.fin2 || "all";
  let fin3 = req.query.fin3 || "all";
  console.log("fin", fin);
  console.log("fin1", fin1);
  console.log("fin2", fin2);
  console.log("fin3", fin3);

  // 取得目前的搜尋內容
  let search = req.query.search || "";
  console.log("search", search);

  // 搜尋
  if (search.length > 2) {
    let [data] = await connection.execute(
      "SELECT * FROM products WHERE name LIKE ?",
      ["%" + search + "%"]
    );
    res.json(data);
  } else {
    // 基底：沒有選擇大小分類
    if (bigCats === 0 && smallCats === 0) {
      // 價格區間篩選:O、品牌篩選:O、顏色篩選:O、衝浪舵篩選:O
      if (
        priceLowest !== "all" &&
        priceHighest !== "all" &&
        brand !== "all" &&
        color === "true" &&
        fin === "true"
      ) {
        let [data] = await connection.execute(
          "SELECT * FROM products WHERE price>=? AND price<=? AND brand_id=? AND color_id IN (?,?,?,?,?,?,?,?,?) AND fin_compatibility_id IN (?,?,?) GROUP BY product_group",
          [
            priceLowest,
            priceHighest,
            brand,
            color1,
            color2,
            color3,
            color4,
            color5,
            color6,
            color7,
            color8,
            color9,
            fin1,
            fin2,
            fin3,
          ]
        );
        res.json(data);
        // 價格區間篩選:O、品牌篩選:O、顏色篩選:O、衝浪舵篩選:X
      } else if (
        priceLowest !== "all" &&
        priceHighest !== "all" &&
        brand !== "all" &&
        color === "true" &&
        fin === "false"
      ) {
        let [data] = await connection.execute(
          "SELECT * FROM products WHERE price>=? AND price<=? AND brand_id=? AND color_id IN (?,?,?,?,?,?,?,?,?) GROUP BY product_group",
          [
            priceLowest,
            priceHighest,
            brand,
            color1,
            color2,
            color3,
            color4,
            color5,
            color6,
            color7,
            color8,
            color9,
          ]
        );
        res.json(data);
        // 價格區間篩選:O、品牌篩選:X、顏色篩選:O、衝浪舵篩選:O
      } else if (
        priceLowest !== "all" &&
        priceHighest !== "all" &&
        brand === "all" &&
        color === "true" &&
        fin === "true"
      ) {
        let [data] = await connection.execute(
          "SELECT * FROM products WHERE price>=? AND price<=? AND color_id IN (?,?,?,?,?,?,?,?,?) AND fin_compatibility_id IN (?,?,?) GROUP BY product_group",
          [
            priceLowest,
            priceHighest,
            color1,
            color2,
            color3,
            color4,
            color5,
            color6,
            color7,
            color8,
            color9,
            fin1,
            fin2,
            fin3,
          ]
        );
        res.json(data);
        // 價格區間篩選:O、品牌篩選:X、顏色篩選:O、衝浪舵篩選:X
      } else if (
        priceLowest !== "all" &&
        priceHighest !== "all" &&
        brand === "all" &&
        color === "true" &&
        fin === "false"
      ) {
        let [data] = await connection.execute(
          "SELECT * FROM products WHERE price>=? AND price<=? AND color_id IN (?,?,?,?,?,?,?,?,?) GROUP BY product_group",
          [
            priceLowest,
            priceHighest,
            color1,
            color2,
            color3,
            color4,
            color5,
            color6,
            color7,
            color8,
            color9,
          ]
        );
        res.json(data);
        // 價格區間篩選:O、品牌篩選:X、顏色篩選:X、衝浪舵篩選:O
      } else if (
        priceLowest !== "all" &&
        priceHighest !== "all" &&
        brand === "all" &&
        color === "false" &&
        fin === "true"
      ) {
        let [data] = await connection.execute(
          "SELECT * FROM products WHERE price>=? AND price<=? AND fin_compatibility_id IN (?,?,?) GROUP BY product_group",
          [priceLowest, priceHighest, fin1, fin2, fin3]
        );
        res.json(data);
        // 價格區間篩選:O、品牌篩選:X、顏色篩選:X、衝浪舵篩選:X
      } else if (
        priceLowest !== "all" &&
        priceHighest !== "all" &&
        brand === "all" &&
        color === "false" &&
        fin === "false"
      ) {
        let [data] = await connection.execute(
          "SELECT * FROM products WHERE price>=? AND price<=? GROUP BY product_group",
          [priceLowest, priceHighest]
        );
        res.json(data);
        // 價格區間篩選:O、品牌篩選:O、顏色篩選:X、衝浪舵篩選:O
      } else if (
        priceLowest !== "all" &&
        priceHighest !== "all" &&
        brand !== "all" &&
        color === "false" &&
        fin === "true"
      ) {
        let [data] = await connection.execute(
          "SELECT * FROM products WHERE price>=? AND price<=? AND brand_id=? AND fin_compatibility_id IN (?,?,?) GROUP BY product_group",
          [priceLowest, priceHighest, brand, fin1, fin2, fin3]
        );
        res.json(data);
        // 價格區間篩選:O、品牌篩選:O、顏色篩選:X、衝浪舵篩選:X
      } else if (
        priceLowest !== "all" &&
        priceHighest !== "all" &&
        brand !== "all" &&
        color === "false" &&
        fin === "false"
      ) {
        let [data] = await connection.execute(
          "SELECT * FROM products WHERE price>=? AND price<=? AND brand_id=? GROUP BY product_group",
          [priceLowest, priceHighest, brand]
        );
        res.json(data);
        // 價格區間篩選:X、品牌篩選:O、顏色篩選:X、衝浪舵篩選:O
      } else if (
        priceLowest === "all" &&
        priceHighest === "all" &&
        brand !== "all" &&
        color === "false" &&
        fin === "true"
      ) {
        let [data] = await connection.execute(
          "SELECT * FROM products WHERE brand_id=? AND fin_compatibility_id IN (?,?,?) GROUP BY product_group",
          [brand, fin1, fin2, fin3]
        );
        res.json(data);
        // 價格區間篩選:X、品牌篩選:O、顏色篩選:X、衝浪舵篩選:X
      } else if (
        priceLowest === "all" &&
        priceHighest === "all" &&
        brand !== "all" &&
        color === "false" &&
        fin === "false"
      ) {
        let [data] = await connection.execute(
          "SELECT * FROM products WHERE brand_id=? GROUP BY product_group",
          [brand]
        );
        res.json(data);
        // 價格區間篩選:X、品牌篩選:O、顏色篩選:O、衝浪舵篩選:O
      } else if (
        priceLowest === "all" &&
        priceHighest === "all" &&
        brand !== "all" &&
        color === "true" &&
        fin === "true"
      ) {
        let [data] = await connection.execute(
          "SELECT * FROM products WHERE brand_id=? AND color_id IN (?,?,?,?,?,?,?,?,?) AND fin_compatibility_id IN (?,?,?) GROUP BY product_group",
          [
            brand,
            color1,
            color2,
            color3,
            color4,
            color5,
            color6,
            color7,
            color8,
            color9,
            fin1,
            fin2,
            fin3,
          ]
        );
        res.json(data);
        // 價格區間篩選:X、品牌篩選:O、顏色篩選:O、衝浪舵篩選:X
      } else if (
        priceLowest === "all" &&
        priceHighest === "all" &&
        brand !== "all" &&
        color === "true" &&
        fin === "false"
      ) {
        let [data] = await connection.execute(
          "SELECT * FROM products WHERE brand_id=? AND color_id IN (?,?,?,?,?,?,?,?,?) GROUP BY product_group",
          [
            brand,
            color1,
            color2,
            color3,
            color4,
            color5,
            color6,
            color7,
            color8,
            color9,
          ]
        );
        res.json(data);
        // 價格區間篩選:X、品牌篩選:X、顏色篩選:O、衝浪舵篩選:O
      } else if (
        priceLowest === "all" &&
        priceHighest === "all" &&
        brand === "all" &&
        color === "true" &&
        fin === "true"
      ) {
        let [data] = await connection.execute(
          "SELECT * FROM products WHERE color_id IN (?,?,?,?,?,?,?,?,?) AND fin_compatibility_id IN (?,?,?) GROUP BY product_group",
          [
            color1,
            color2,
            color3,
            color4,
            color5,
            color6,
            color7,
            color8,
            color9,
            fin1,
            fin2,
            fin3,
          ]
        );
        res.json(data);
        // 價格區間篩選:X、品牌篩選:X、顏色篩選:O、衝浪舵篩選:X
      } else if (
        priceLowest === "all" &&
        priceHighest === "all" &&
        brand === "all" &&
        color === "true" &&
        fin === "false"
      ) {
        let [data] = await connection.execute(
          "SELECT * FROM products WHERE color_id IN (?,?,?,?,?,?,?,?,?) GROUP BY product_group",
          [
            color1,
            color2,
            color3,
            color4,
            color5,
            color6,
            color7,
            color8,
            color9,
          ]
        );
        res.json(data);
        // 價格區間篩選:X、品牌篩選:X、顏色篩選:X、衝浪舵篩選:O
      } else if (
        priceLowest === "all" &&
        priceHighest === "all" &&
        brand === "all" &&
        color === "false" &&
        fin === "true"
      ) {
        let [data] = await connection.execute(
          "SELECT * FROM products WHERE fin_compatibility_id IN (?,?,?) GROUP BY product_group",
          [fin1, fin2, fin3]
        );
        res.json(data);
        // 價格區間篩選:X、品牌篩選:X、顏色篩選:X、衝浪舵篩選:X 試做分頁ing
      } else {
        // 取得目前在第幾頁
        let page = req.query.page || 1;
        console.log("page", page);

        // 取得目前的總筆數
        let [total] = await connection.execute(
          "SELECT COUNT(*) AS total FROM products GROUP BY product_group"
        );
        console.log("total物件", total);
        total = total.length;
        console.log("total", total);

        // 計算總共應該要有幾頁 lastPage
        const perPage = 16;
        const lastPage = Math.ceil(total / perPage);

        // 計算 SQL 要用的 offset
        let offset = (page - 1) * perPage;
        // 取得資料
        let [data] = await connection.execute(
          "SELECT * FROM products GROUP BY product_group LIMIT ? OFFSET ?",
          [perPage, offset]
        );

        res.json({
          pagination: { total, perPage, page, lastPage },
          data,
        });

        // let [data] = await connection.execute(
        //   "SELECT * FROM products GROUP BY product_group"
        // );
        // res.json(data);
      }
      // 基底：選擇大分類
    } else if (bigCats !== 0 && smallCats === 0) {
      // 價格區間篩選:O、品牌篩選:O、顏色篩選:O、衝浪舵篩選:O
      if (
        priceLowest !== "all" &&
        priceHighest !== "all" &&
        brand !== "all" &&
        color === "true" &&
        fin === "true"
      ) {
        let [data] = await connection.execute(
          "SELECT * FROM products WHERE big_cat_id=? AND price>=? AND price<=? AND brand_id=? AND color_id IN (?,?,?,?,?,?,?,?,?) AND fin_compatibility_id IN (?,?,?) GROUP BY product_group",
          [
            bigCats,
            priceLowest,
            priceHighest,
            brand,
            color1,
            color2,
            color3,
            color4,
            color5,
            color6,
            color7,
            color8,
            color9,
            fin1,
            fin2,
            fin3,
          ]
        );
        res.json(data);
        // 價格區間篩選:O、品牌篩選:O、顏色篩選:O、衝浪舵:X
      } else if (
        priceLowest !== "all" &&
        priceHighest !== "all" &&
        brand !== "all" &&
        color === "true" &&
        fin === "false"
      ) {
        let [data] = await connection.execute(
          "SELECT * FROM products WHERE big_cat_id=? AND price>=? AND price<=? AND brand_id=? AND color_id IN (?,?,?,?,?,?,?,?,?) GROUP BY product_group",
          [
            bigCats,
            priceLowest,
            priceHighest,
            brand,
            color1,
            color2,
            color3,
            color4,
            color5,
            color6,
            color7,
            color8,
            color9,
          ]
        );
        res.json(data);
        // 價格區間篩選:O、品牌篩選:X、顏色篩選:O、衝浪舵:O
      } else if (
        priceLowest !== "all" &&
        priceHighest !== "all" &&
        brand === "all" &&
        color === "true" &&
        fin === "true"
      ) {
        let [data] = await connection.execute(
          "SELECT * FROM products WHERE big_cat_id=? AND price>=? AND price<=? AND color_id IN (?,?,?,?,?,?,?,?,?) AND fin_compatibility_id IN (?,?,?) GROUP BY product_group",
          [
            bigCats,
            priceLowest,
            priceHighest,
            color1,
            color2,
            color3,
            color4,
            color5,
            color6,
            color7,
            color8,
            color9,
            fin1,
            fin2,
            fin3,
          ]
        );
        res.json(data);
        // 價格區間篩選:O、品牌篩選:X、顏色篩選:O、衝浪舵:X
      } else if (
        priceLowest !== "all" &&
        priceHighest !== "all" &&
        brand === "all" &&
        color === "true" &&
        fin === "false"
      ) {
        let [data] = await connection.execute(
          "SELECT * FROM products WHERE big_cat_id=? AND price>=? AND price<=? AND color_id IN (?,?,?,?,?,?,?,?,?) GROUP BY product_group",
          [
            bigCats,
            priceLowest,
            priceHighest,
            color1,
            color2,
            color3,
            color4,
            color5,
            color6,
            color7,
            color8,
            color9,
          ]
        );
        res.json(data);
        // 價格區間篩選:O、品牌篩選:X、顏色篩選:X、衝浪舵篩選:O
      } else if (
        priceLowest !== "all" &&
        priceHighest !== "all" &&
        brand === "all" &&
        color === "false" &&
        fin === "true"
      ) {
        let [data] = await connection.execute(
          "SELECT * FROM products WHERE big_cat_id=? AND price>=? AND price<=? AND fin_compatibility_id IN (?,?,?) GROUP BY product_group",
          [bigCats, priceLowest, priceHighest, fin1, fin2, fin3]
        );
        res.json(data);
        // 價格區間篩選:O、品牌篩選:X、顏色篩選:X、衝浪舵篩選:X
      } else if (
        priceLowest !== "all" &&
        priceHighest !== "all" &&
        brand === "all" &&
        color === "false" &&
        fin === "false"
      ) {
        let [data] = await connection.execute(
          "SELECT * FROM products WHERE big_cat_id=? AND price>=? AND price<=? GROUP BY product_group",
          [bigCats, priceLowest, priceHighest]
        );
        res.json(data);
        // 價格區間篩選:O、品牌篩選:O、顏色篩選:X、衝浪舵篩選:O
      } else if (
        priceLowest !== "all" &&
        priceHighest !== "all" &&
        brand !== "all" &&
        color === "false" &&
        fin === "true"
      ) {
        let [data] = await connection.execute(
          "SELECT * FROM products WHERE big_cat_id=? AND price>=? AND price<=? AND brand_id=? AND fin_compatibility_id IN (?,?,?) GROUP BY product_group",
          [bigCats, priceLowest, priceHighest, brand, fin1, fin2, fin3]
        );
        res.json(data);
        // 價格區間篩選:O、品牌篩選:O、顏色篩選:X、衝浪舵篩選:X
      } else if (
        priceLowest !== "all" &&
        priceHighest !== "all" &&
        brand !== "all" &&
        color === "false" &&
        fin === "false"
      ) {
        let [data] = await connection.execute(
          "SELECT * FROM products WHERE big_cat_id=? AND price>=? AND price<=? AND brand_id=? GROUP BY product_group",
          [bigCats, priceLowest, priceHighest, brand]
        );
        res.json(data);
        // 價格區間篩選:X、品牌篩選:O、顏色篩選:X、衝浪舵篩選:O
      } else if (
        priceLowest === "all" &&
        priceHighest === "all" &&
        brand !== "all" &&
        color === "false" &&
        fin === "true"
      ) {
        let [data] = await connection.execute(
          "SELECT * FROM products WHERE big_cat_id=? AND brand_id=? AND fin_compatibility_id IN (?,?,?) GROUP BY product_group",
          [bigCats, brand, fin1, fin2, fin3]
        );
        res.json(data);
        // 價格區間篩選:X、品牌篩選:O、顏色篩選:X、衝浪舵篩選:X
      } else if (
        priceLowest === "all" &&
        priceHighest === "all" &&
        brand !== "all" &&
        color === "false" &&
        fin === "false"
      ) {
        let [data] = await connection.execute(
          "SELECT * FROM products WHERE big_cat_id=? AND brand_id=? GROUP BY product_group",
          [bigCats, brand]
        );
        res.json(data);
        // 價格區間篩選:X、品牌篩選:O、顏色篩選:O、衝浪舵篩選:O
      } else if (
        priceLowest === "all" &&
        priceHighest === "all" &&
        brand !== "all" &&
        color === "true" &&
        fin === "true"
      ) {
        let [data] = await connection.execute(
          "SELECT * FROM products WHERE big_cat_id=? AND brand_id=? AND color_id IN (?,?,?,?,?,?,?,?,?) AND fin_compatibility_id IN (?,?,?) GROUP BY product_group",
          [
            bigCats,
            brand,
            color1,
            color2,
            color3,
            color4,
            color5,
            color6,
            color7,
            color8,
            color9,
            fin1,
            fin2,
            fin3,
          ]
        );
        res.json(data);
        // 價格區間篩選:X、品牌篩選:O、顏色篩選:O、衝浪舵篩選:X
      } else if (
        priceLowest === "all" &&
        priceHighest === "all" &&
        brand !== "all" &&
        color === "true" &&
        fin === "false"
      ) {
        let [data] = await connection.execute(
          "SELECT * FROM products WHERE big_cat_id=? AND brand_id=? AND color_id IN (?,?,?,?,?,?,?,?,?) GROUP BY product_group",
          [
            bigCats,
            brand,
            color1,
            color2,
            color3,
            color4,
            color5,
            color6,
            color7,
            color8,
            color9,
          ]
        );
        res.json(data);
        // 價格區間篩選:X、品牌篩選:X、顏色篩選:O、衝浪舵篩選:O
      } else if (
        priceLowest === "all" &&
        priceHighest === "all" &&
        brand === "all" &&
        color === "true" &&
        fin === "true"
      ) {
        let [data] = await connection.execute(
          "SELECT * FROM products WHERE big_cat_id=? AND color_id IN (?,?,?,?,?,?,?,?,?) AND fin_compatibility_id IN (?,?,?) GROUP BY product_group",
          [
            bigCats,
            color1,
            color2,
            color3,
            color4,
            color5,
            color6,
            color7,
            color8,
            color9,
            fin1,
            fin2,
            fin3,
          ]
        );
        res.json(data);
        // 價格區間篩選:X、品牌篩選:X、顏色篩選:O、衝浪舵篩選:X
      } else if (
        priceLowest === "all" &&
        priceHighest === "all" &&
        brand === "all" &&
        color === "true" &&
        fin === "false"
      ) {
        let [data] = await connection.execute(
          "SELECT * FROM products WHERE big_cat_id=? AND color_id IN (?,?,?,?,?,?,?,?,?) GROUP BY product_group",
          [
            bigCats,
            color1,
            color2,
            color3,
            color4,
            color5,
            color6,
            color7,
            color8,
            color9,
          ]
        );
        res.json(data);
        // 價格區間篩選:X、品牌篩選:X、顏色篩選:X、衝浪舵篩選:O
      } else if (
        priceLowest === "all" &&
        priceHighest === "all" &&
        brand === "all" &&
        color === "false" &&
        fin === "true"
      ) {
        let [data] = await connection.execute(
          "SELECT * FROM products WHERE big_cat_id=? AND fin_compatibility_id IN (?,?,?) GROUP BY product_group",
          [bigCats, fin1, fin2, fin3]
        );
        res.json(data);
        // 價格區間篩選:X、品牌篩選:X、顏色篩選:X、衝浪舵篩選:X
      } else {
        let [data] = await connection.execute(
          "SELECT * FROM products WHERE big_cat_id=? GROUP BY product_group",
          [bigCats]
        );
        res.json(data);
      }
      // 基底：選擇小分類
    } else if (smallCats !== 0) {
      // 價格區間篩選:O、品牌篩選:O、顏色篩選:O、衝浪舵篩選:O
      if (
        priceLowest !== "all" &&
        priceHighest !== "all" &&
        brand !== "all" &&
        color === "true" &&
        fin === "true"
      ) {
        let [data] = await connection.execute(
          "SELECT * FROM products WHERE small_cat_id=? AND price>=? AND price<=? AND brand_id=? AND color_id IN (?,?,?,?,?,?,?,?,?) AND fin_compatibility_id IN (?,?,?) GROUP BY product_group",
          [
            smallCats,
            priceLowest,
            priceHighest,
            brand,
            color1,
            color2,
            color3,
            color4,
            color5,
            color6,
            color7,
            color8,
            color9,
            fin1,
            fin2,
            fin3,
          ]
        );
        res.json(data);
        // 價格區間篩選:O、品牌篩選:O、顏色篩選:O、衝浪舵篩選:X
      } else if (
        priceLowest !== "all" &&
        priceHighest !== "all" &&
        brand !== "all" &&
        color === "true" &&
        fin === "false"
      ) {
        let [data] = await connection.execute(
          "SELECT * FROM products WHERE small_cat_id=? AND price>=? AND price<=? AND brand_id=? AND color_id IN (?,?,?,?,?,?,?,?,?) GROUP BY product_group",
          [
            smallCats,
            priceLowest,
            priceHighest,
            brand,
            color1,
            color2,
            color3,
            color4,
            color5,
            color6,
            color7,
            color8,
            color9,
          ]
        );
        res.json(data);
        // 價格區間篩選:O、品牌篩選:X、顏色篩選:O、衝浪舵篩選:O
      } else if (
        priceLowest !== "all" &&
        priceHighest !== "all" &&
        brand === "all" &&
        color === "true" &&
        fin === "true"
      ) {
        let [data] = await connection.execute(
          "SELECT * FROM products WHERE small_cat_id=? AND price>=? AND price<=? AND color_id IN (?,?,?,?,?,?,?,?,?) AND fin_compatibility_id IN (?,?,?) GROUP BY product_group",
          [
            smallCats,
            priceLowest,
            priceHighest,
            color1,
            color2,
            color3,
            color4,
            color5,
            color6,
            color7,
            color8,
            color9,
            fin1,
            fin2,
            fin3,
          ]
        );
        res.json(data);
        // 價格區間篩選:O、品牌篩選:X、顏色篩選:O、衝浪舵篩選:X
      } else if (
        priceLowest !== "all" &&
        priceHighest !== "all" &&
        brand === "all" &&
        color === "true" &&
        fin === "false"
      ) {
        let [data] = await connection.execute(
          "SELECT * FROM products WHERE small_cat_id=? AND price>=? AND price<=? AND color_id IN (?,?,?,?,?,?,?,?,?) GROUP BY product_group",
          [
            smallCats,
            priceLowest,
            priceHighest,
            color1,
            color2,
            color3,
            color4,
            color5,
            color6,
            color7,
            color8,
            color9,
          ]
        );
        res.json(data);
        // 價格區間篩選:O、品牌篩選:X、顏色篩選:X、衝浪舵篩選:O
      } else if (
        priceLowest !== "all" &&
        priceHighest !== "all" &&
        brand === "all" &&
        color === "false" &&
        fin === "true"
      ) {
        let [data] = await connection.execute(
          "SELECT * FROM products WHERE small_cat_id=? AND price>=? AND price<=? AND fin_compatibility_id IN (?,?,?) GROUP BY product_group",
          [smallCats, priceLowest, priceHighest, fin1, fin2, fin3]
        );
        res.json(data);
        // 價格區間篩選:O、品牌篩選:X、顏色篩選:X、衝浪舵篩選:X
      } else if (
        priceLowest !== "all" &&
        priceHighest !== "all" &&
        brand === "all" &&
        color === "false" &&
        fin === "false"
      ) {
        let [data] = await connection.execute(
          "SELECT * FROM products WHERE small_cat_id=? AND price>=? AND price<=? GROUP BY product_group",
          [smallCats, priceLowest, priceHighest]
        );
        res.json(data);
        // 價格區間篩選:O、品牌篩選:O、顏色篩選:X、衝浪舵篩選:O
      } else if (
        priceLowest !== "all" &&
        priceHighest !== "all" &&
        brand !== "all" &&
        color === "false" &&
        fin === "true"
      ) {
        let [data] = await connection.execute(
          "SELECT * FROM products WHERE small_cat_id=? AND price>=? AND price<=? AND brand_id=? AND fin_compatibility_id IN (?,?,?) GROUP BY product_group",
          [smallCats, priceLowest, priceHighest, brand, fin1, fin2, fin3]
        );
        res.json(data);
        // 價格區間篩選:O、品牌篩選:O、顏色篩選:X、衝浪舵篩選:X
      } else if (
        priceLowest !== "all" &&
        priceHighest !== "all" &&
        brand !== "all" &&
        color === "false" &&
        fin === "false"
      ) {
        let [data] = await connection.execute(
          "SELECT * FROM products WHERE small_cat_id=? AND price>=? AND price<=? AND brand_id=? GROUP BY product_group",
          [smallCats, priceLowest, priceHighest, brand]
        );
        res.json(data);
        // 價格區間篩選:X、品牌篩選:O、顏色篩選:X、衝浪舵篩選:O
      } else if (
        priceLowest === "all" &&
        priceHighest === "all" &&
        brand !== "all" &&
        color === "false" &&
        fin === "true"
      ) {
        let [data] = await connection.execute(
          "SELECT * FROM products WHERE small_cat_id=? AND brand_id=? AND fin_compatibility_id IN (?,?,?) GROUP BY product_group",
          [smallCats, brand, fin1, fin2, fin3]
        );
        res.json(data);
        // 價格區間篩選:X、品牌篩選:O、顏色篩選:X、衝浪舵篩選:X
      } else if (
        priceLowest === "all" &&
        priceHighest === "all" &&
        brand !== "all" &&
        color === "false" &&
        fin === "false"
      ) {
        let [data] = await connection.execute(
          "SELECT * FROM products WHERE small_cat_id=? AND brand_id=? GROUP BY product_group",
          [smallCats, brand]
        );
        res.json(data);
        // 價格區間篩選:X、品牌篩選:O、顏色篩選:O、衝浪舵篩選:O
      } else if (
        priceLowest === "all" &&
        priceHighest === "all" &&
        brand !== "all" &&
        color === "true" &&
        fin === "true"
      ) {
        let [data] = await connection.execute(
          "SELECT * FROM products WHERE small_cat_id=? AND brand_id=? AND color_id IN (?,?,?,?,?,?,?,?,?) AND fin_compatibility_id IN (?,?,?) GROUP BY product_group",
          [
            smallCats,
            brand,
            color1,
            color2,
            color3,
            color4,
            color5,
            color6,
            color7,
            color8,
            color9,
            fin1,
            fin2,
            fin3,
          ]
        );
        res.json(data);
        // 價格區間篩選:X、品牌篩選:O、顏色篩選:O、衝浪舵篩選:X
      } else if (
        priceLowest === "all" &&
        priceHighest === "all" &&
        brand !== "all" &&
        color === "true" &&
        fin === "false"
      ) {
        let [data] = await connection.execute(
          "SELECT * FROM products WHERE small_cat_id=? AND brand_id=? AND color_id IN (?,?,?,?,?,?,?,?,?) GROUP BY product_group",
          [
            smallCats,
            brand,
            color1,
            color2,
            color3,
            color4,
            color5,
            color6,
            color7,
            color8,
            color9,
          ]
        );
        res.json(data);
        // 價格區間篩選:X、品牌篩選:X、顏色篩選:O、衝浪舵篩選:O
      } else if (
        priceLowest === "all" &&
        priceHighest === "all" &&
        brand === "all" &&
        color === "true" &&
        fin === "true"
      ) {
        let [data] = await connection.execute(
          "SELECT * FROM products WHERE small_cat_id=? AND color_id IN (?,?,?,?,?,?,?,?,?) AND fin_compatibility_id IN (?,?,?) GROUP BY product_group",
          [
            smallCats,
            color1,
            color2,
            color3,
            color4,
            color5,
            color6,
            color7,
            color8,
            color9,
            fin1,
            fin2,
            fin3,
          ]
        );
        res.json(data);
        // 價格區間篩選:X、品牌篩選:X、顏色篩選:O、衝浪舵篩選:X
      } else if (
        priceLowest === "all" &&
        priceHighest === "all" &&
        brand === "all" &&
        color === "true" &&
        fin === "false"
      ) {
        let [data] = await connection.execute(
          "SELECT * FROM products WHERE small_cat_id=? AND color_id IN (?,?,?,?,?,?,?,?,?) GROUP BY product_group",
          [
            smallCats,
            color1,
            color2,
            color3,
            color4,
            color5,
            color6,
            color7,
            color8,
            color9,
          ]
        );
        res.json(data);
        // 價格區間篩選:X、品牌篩選:X、顏色篩選:X、衝浪舵篩選:O
      } else if (
        priceLowest === "all" &&
        priceHighest === "all" &&
        brand === "all" &&
        color === "false" &&
        fin === "true"
      ) {
        let [data] = await connection.execute(
          "SELECT * FROM products WHERE small_cat_id=? AND fin_compatibility_id IN (?,?,?) GROUP BY product_group",
          [smallCats, fin1, fin2, fin3]
        );
        res.json(data);
        // 價格區間篩選:X、品牌篩選:X、顏色篩選:X、衝浪舵篩選:X
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

module.exports = router;
