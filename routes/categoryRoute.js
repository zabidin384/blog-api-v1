const express = require("express");
const isLogin = require("../middlewares/isLogin");
const router = express.Router();
const { createCategory, getAllCategory, getCategory, deleteCategory, updateCategory } = require("../controllers/categoryController");

router.post("/", isLogin, createCategory);
router.get("/all", getAllCategory);
router.get("/:id", getCategory);
router.delete("/:id", isLogin, deleteCategory);
router.put("/:id", isLogin, updateCategory);

module.exports = router;
