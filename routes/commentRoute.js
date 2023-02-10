const express = require("express");
const isLogin = require("../middlewares/isLogin");
const router = express.Router();
const { createComment, getComment, deleteComment, updateComment } = require("../controllers/commentController");

router.post("/:id", isLogin, createComment);
router.get("/:id", isLogin, getComment);
router.delete("/:id", isLogin, deleteComment);
router.put("/:id", isLogin, updateComment);

module.exports = router;
