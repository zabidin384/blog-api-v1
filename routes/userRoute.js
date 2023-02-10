const express = require("express");
const multer = require("multer");
const router = express.Router();
// Files
const isAdmin = require("../middlewares/isAdmin");
const isLogin = require("../middlewares/isLogin");
const storage = require("../config/cloudinary");
const {
	registerUser,
	loginUser,
	getUser,
	getAllUser,
	deleteUser,
	updateUser,
	updatePassword,
	uploadProfilePhoto,
	whoViewedMyProfile,
	followUser,
	unFollowUser,
	blockUser,
	unBlockUser,
	adminBlock,
	adminUnblock,
	deleteAccount,
} = require("../controllers/userController");

const upload = multer({ storage });

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/all", getAllUser);
router.get("/profile", isLogin, getUser);
router.delete("/", isLogin, deleteAccount);
router.put("/", isLogin, updateUser);
router.put("/", isLogin, updateUser);
router.put("/password", isLogin, updatePassword);
router.get("/viewers/:id", isLogin, whoViewedMyProfile);
router.get("/follow/:id", isLogin, followUser);
router.get("/unfollow/:id", isLogin, unFollowUser);
router.get("/block/:id", isLogin, blockUser);
router.get("/unblock/:id", isLogin, unBlockUser);
router.put("/admin-block/:id", isLogin, isAdmin, adminBlock);
router.put("/admin-unblock/:id", isLogin, isAdmin, adminUnblock);
router.post("/profile-photo", isLogin, upload.single("profile"), uploadProfilePhoto);

module.exports = router;
