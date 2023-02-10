const express = require("express");
const multer = require("multer");
const router = express.Router();
// Files
const isLogin = require("../middlewares/isLogin");
const storage = require("../config/cloudinary");
const { createPost, getPost, getAllPost, deletePost, updatePost, likePostToggle, disLikePostToggle } = require("../controllers/postController");

const upload = multer({ storage });

router.post("/", isLogin, upload.single("image"), createPost);
router.get("/", isLogin, getAllPost);
router.get("/:id", isLogin, getPost);
router.delete("/:id", isLogin, deletePost);
router.put("/:id", isLogin, upload.single("image"), updatePost);
router.post("/like/:id", isLogin, likePostToggle);
router.post("/dislike/:id", isLogin, disLikePostToggle);

module.exports = router;
