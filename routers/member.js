// 這裏 member 的 router
const express = require("express");
const router = express.Router();
const memberController = require("../controllers/member");

// RESTful API 的列表
router.get("/", memberController.getAll);

router.get("/:stockId", memberController.getPriceByCode);

module.exports = router;