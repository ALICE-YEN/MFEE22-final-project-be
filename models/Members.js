// /models/member
// const { append } = require("express/lib/response");
const connection = require("../utils/db");

// 取得MemberOrder資料
async function getMemberOrder() {
  let [data, fields] = await connection.execute("SELECT * FROM order_list");
  console.log(data);
  return data;
}
// 取得全部資料
async function getAll(orderId) {
  let [data, fields] = await connection.execute(
    // "SELECT * FROM order_list, order_details, products, member"
    "SELECT * FROM ((order_details INNER JOIN products ON order_details.product_id = products.product_id) INNER JOIN order_list ON order_details.order_id = order_list.id) INNER JOIN member ON order_list.member_id = member.member_id WHERE order_id=?",
    // "SELECT * FROM order_details WHERE id=?",
    [orderId]
  );
  console.log(data);
  return data;
}

// 取得某個股票代碼的總筆數
// async function countByCode(member_id) {
//   let [total] = await connection.execute(
//     "SELECT COUNT(*) AS total FROM order_details WHERE member_id=?",
//     [member_id]
//   );
//   return total[0].total;
// }

// async function getMemberDetailsByCode(member_id, perPage, offset) {
//   let [data] = await connection.execute(
//     "SELECT * FROM order_details WHERE member_id=? ORDER BY date LIMIT ? OFFSET ?",
//     [member_id, perPage, offset]
//   );
//   return data;
// }

// async function getMemberDetailsByCode(member_id) {
//   let [data] = await connection.execute(
//     "SELECT * FROM order_details WHERE member_id=? ORDER BY date LIMIT ? OFFSET ?",
//     // "SELECT * FROM order_details WHERE member_id=?",
//     [member_id]
//   );
//   return data;
// }

module.exports = {
  getMemberOrder,
  getAll,
  // countByCode,
  // getMemberDetailsByCode,
};
