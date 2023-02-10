const mongoose = require("mongoose");

const replySchema = new mongoose.Schema(
	{
		comment: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Comment",
			required: [true, "is required!"],
		},
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: [true, "is required!"],
		},
		description: {
			type: String,
			required: [true, "is required!"],
		},
	},
	{
		timestamps: true,
	}
);

const Reply = mongoose.model("Reply", replySchema);
module.exports = Reply;
