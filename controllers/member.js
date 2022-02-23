// /controllers/member
const memberModel = require("../models/Members");

let getMemberList = async (req, res, next) => {
  let member = await memberModel.getMemberList();
  // res.send ==> 純文字
  // res.render ==> server-side render 會去找樣板
  res.json(member);
};

let getMemberOrderList = async (req, res, next) => {
  let data = await memberModel.getMemberOrderList();
  res.json(data);
};

let getMemberCourseOrderList = async (req, res, next) => {
  let data = await memberModel.getMemberCourseOrderList();
  res.json(data);
};

let getMember = async (req, res, next) => {
  let member = await memberModel.getMember(req.params.memberId);
  res.json(member);
};

let getMemberOrder = async (req, res, next) => {
  let data = await memberModel.getMemberOrder(req.params.orderId);
  res.json({
    data,
  });
};

// let getMemberCourseOrder = async (req, res, next) => {
//   let data = await memberModel.getMemberCourseOrder(req.params.courseId);
//   res.json({
//     data,
//   });
// };

module.exports = {
  getMemberList,
  getMemberOrderList,
  getMemberCourseOrderList,
  getMember,
  getMemberOrder,
  getMemberCourseOrder,
};
