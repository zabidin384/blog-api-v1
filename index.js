const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
require("./config/dbConnect");
// Files
const userRoute = require("./routes/userRoute");
const postRoute = require("./routes/postRoute");
const commentRoute = require("./routes/commentRoute");
const replyRoute = require("./routes/replyRoute");
const categoryRoute = require("./routes/categoryRoute");

const app = express();

// middlewares
app.use(express.json()); // pass incoming payload

// routes
app.use("/api/v1/users", userRoute);
app.use("/api/v1/posts", postRoute);
app.use("/api/v1/comments", commentRoute);
app.use("/api/v1/reply", replyRoute);
app.use("/api/v1/categories", categoryRoute);

// 404 error
app.use("*", (req, res) => {
	res.status(404).json({
		route: req.originalUrl,
		message: "Route not found!",
	});
});

// listen to server
const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server is up and running on port ${PORT}`));
