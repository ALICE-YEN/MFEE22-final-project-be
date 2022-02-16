// 這裏 MemberOrder 的 router
const express = require('express');
const router = express.Router();

const connection = require('../utlis/db');

// RESTful API 的列表
router.get('/', async (req, res, next) => {
  let [data, fields] = await connection.execute('SELECT * FROM order_list');
  console.log(data);
  // res.send ==> 純文字
  // res.render ==> server-side render 會去找樣板
  res.json(data);
});

router.get('/:id', async (req, res, next) => {
  // req.params.id
  // req.query.page <- 第幾頁

  // 取得目前在第幾頁
  // 如果沒有設定 req.quyer.page，那就設成 1
  let page = req.query.page || 1;
  console.log('aaaaaaaaa', page);

  // 取得目前的總筆數
  let [total] = await connection.execute(
    'SELECT COUNT(*) AS total FROM order_list WHERE id=?',
    [req.params.id]
  );
  console.log('bbbbbbb', total); // [ { total: 15 } ]
  total = total[0].total; // total = 15

  // 計算總共應該要有幾頁
  const perPage = 3;
  // lastPage: 總共有幾頁
  const lastPage = Math.ceil(total / perPage);

  // 計算 SQL 要用的 offset
  let offset = (page - 1) * perPage;
  // 取得資料
  let [data] = await connection.execute(
    'SELECT * FROM order_list WHERE id=? ORDER BY date LIMIT ? OFFSET ?',
    [req.params.id, perPage, offset]
  );

  // 準備要 response
  res.json({
    pagination: { total, perPage, page, lastPage },
    data,
  });
});

module.exports = router;
