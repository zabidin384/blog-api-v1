const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: [true, "is required!"],
			trim: true,
		},
		description: {
			type: String,
			required: [true, "is required!"],
		},
		category: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Category",
			required: [true, "is required!"],
		},
		numViews: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
		],
		likes: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
		],
		disLikes: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
		],
		author: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: [true, "is required!"],
		},
		photo: {
			type: String,
			default: "",
			// required: [true, "Post image is required!"],
		},
		comments: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Comment",
			},
		],
	},
	{
		timestamps: true,
	}
);

// Compile the post model
const Post = mongoose.model("Post", postSchema);
module.exports = Post;
