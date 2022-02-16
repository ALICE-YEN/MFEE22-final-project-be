// 引入 express
const express = require('express');
require('dotenv').config();
// path 是 nodejs 內建的 lib
const path = require('path');
const cors = require('cors');

// 利用 express 這個 library 來建立一個 web app (express instance)
let app = express();

// express 是由 middleware 組成的
// request -> middleware 1 -> middleware 2 -> ... -> response
// 中間件順序很重要!! Express 會按照你程式碼的順序去決定 next 是誰
// 中間件裡一定要有 next 或是 res.xxx
// next: 往下一關走
// res.xxx 結束這次的旅程 (req-res cycle)

// 使用第三方開發的 cors 中間件
app.use(cors());

// express.urlencoded 要讓 express 認得 body 裡的資料
// extended: false -> querystring
// extended: true -> qs
app.use(express.urlencoded({ extended: true }));
//  要讓 express 認得 json
app.use(express.json());

// 使用 express 內建的中間件
// 靜態檔案: 圖片、js 檔案、css 檔案, html...
app.use(express.static(path.join(__dirname, 'assets')));
app.use('/static', express.static(path.join(__dirname, 'public')));

// 一般中間件(自己開發的)
// app.use(function (request, response, next) {});
app.use((req, res, next) => {
  let current = new Date();
  console.log(`有人來拜訪嚕 at ${current.toISOString()}`);
  next();
});

let memberRouter = require('./routers/Member');
app.use('/api/Member', memberRouter);

// 在所有路由中間件的後
// 既然前面都比對不到，那表示這裡是 404
// 利用「順序」這件事來做 404
app.use((req, res, next) => {
  console.log('在所有路由中間件的後面 -> 404');
  res.status(404).send('Not Found');
});

// 錯誤中間件：放在所有中間件的後面
// 有四個參數，是用來「捕捉」錯誤的
app.use((err, req, res, next) => {
  console.log('來自四個參數的錯誤處理中間件', err);
  res.status(500).send('Server 錯誤: 請洽系統管理員');
});

const port = process.env.SERVER_PORT || 3000;
app.listen(port, () => {
  console.log(`Server running at port ${port}`);
});
