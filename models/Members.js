// /models/member
// const { append } = require("express/lib/response");
const connection = require("../utils/db");

// 取得MemberList全部資料
async function getMemberList() {
  let [member] = await connection.execute("SELECT * FROM member");
  console.log(member);
  return member;
}

// 取得MemberOrder資料
async function getMemberOrderList() {
  let [data] = await connection.execute(
    "SELECT * FROM order_list ORDER BY order_time DESC"
  );
  console.log(data);
  return data;
}

// 取得MemberCourseOrder資料
async function getMemberCourseOrderList() {
  let [data] = await connection.execute(
    "SELECT * FROM course_order ORDER BY courseDate DESC"
  );
  console.log(data);
  return data;
}

// 取得Member資料
async function getMember(memberId) {
  let [member] = await connection.execute(
    "SELECT * FROM member WHERE member_id=?",
    [memberId]
  );
  console.log(member);
  return member;
}

// 取得OrderList全部資料
async function getMemberOrder(orderId) {
  let [data] = await connection.execute(
    "SELECT * FROM ((order_details INNER JOIN products ON order_details.product_id = products.product_id) INNER JOIN order_list ON order_details.order_id = order_list.id) INNER JOIN member ON order_list.member_id = member.member_id WHERE member.member_id=?",
    [orderId]
  );
  console.log(data);
  return data;
}

// 取得CourseOrderList全部資料
// async function getMemberCourseOrder(courseId) {
//   let [data] = await connection.execute([courseId]);
//   console.log(data);
//   return data;
// }

module.exports = {
  getMemberList,
  getMemberOrderList,
  getMemberCourseOrderList,
  getMember,
  getMemberOrder,
  // getMemberCourseOrder,
};
