const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
	{
		post: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Post",
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
		reply: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Reply",
			},
		],
	},
	{
		timestamps: true,
	}
);

const Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;
