const express = require("express");
const isLogin = require("../middlewares/isLogin");
const router = express.Router();
const { createReply, getReply, deleteReply, updateReply } = require("../controllers/replyController");

router.post("/:id", isLogin, createReply);
router.get("/:id", isLogin, getReply);
router.delete("/:id", isLogin, deleteReply);
router.put("/:id", isLogin, updateReply);

module.exports = router;
