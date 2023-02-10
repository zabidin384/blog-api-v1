const getTokenHeader = require("../utils/getTokenHeader");
const verifyToken = require("../utils/verifyToken");
const userModel = require("../models/userModel");

const isAdmin = async (req, res, next) => {
	const token = getTokenHeader(req);
	const decodedUser = verifyToken(token);

	req.userAuth = decodedUser.id || null;

	const user = await userModel.findById(decodedUser.id);

	if (user.isAdmin) return next();
	else return res.status(403).json({ message: "You are not an admin!" });
};

module.exports = isAdmin;
