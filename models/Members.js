// /models/member
const connection = require("../utils/db");

// 取得全部資料
async function getAll() {
  let [data, fields] = await connection.execute("SELECT * FROM order_list");
  console.log(data);
  return data;
}

// 取得某個股票代碼的總筆數
async function countByCode(member_id) {
  let [total] = await connection.execute(
    "SELECT COUNT(*) AS total FROM order_details WHERE member_id=?",
    [member_id]
  );
  return total[0].total;
}

async function getPriceByCode(stockId, perPage, offset) {
  let [data] = await connection.execute(
    "SELECT * FROM order_details WHERE member_id=? ORDER BY date LIMIT ? OFFSET ?",
    [stockId, perPage, offset]
  );
  return data;
}

module.exports = {
  getAll,
  countByCode,
  getPriceByCode,
};
