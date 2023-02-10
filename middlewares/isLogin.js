const getTokenHeader = require("../utils/getTokenHeader");
const verifyToken = require("../utils/verifyToken");

const isLogin = (req, res, next) => {
	const token = getTokenHeader(req);
	const decodedUser = verifyToken(token);

	req.userAuth = decodedUser.id || null;

	if (!decodedUser) return res.status(400).json({ message: "Invalid/expired token!" });
	else next();
};

module.exports = isLogin;
