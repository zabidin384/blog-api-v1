const commentModel = require("../models/commentModel");
const postModel = require("../models/postModel");
const userModel = require("../models/userModel");

const createComment = async (req, res) => {
	const { description } = req.body;
	const { id } = req.params;

	try {
		const author = await userModel.findById(req.userAuth);
		if (author.isBlocked) return res.status(403).json({ message: "Your account is blocked, you can't send any comment!" });

		const post = await postModel.findById(id);
		if (!post) return res.status(404).json({ message: "The post is not found!" });

		const commentCreated = await commentModel.create({ description, user: req.userAuth, post: id });

		post.comments.push(commentCreated);
		await post.save();

		res.status(201).json({
			status: "success",
			data: "Comment has been created successfully",
		});
	} catch (error) {
		res.status(500).json(error.message);
	}
};

const getComment = async (req, res) => {
	try {
		const comment = await commentModel.findById(req.params.id);
		if (!comment) return res.status(404).json({ message: "The comment is not found!" });

		res.status(200).json({
			status: "success",
			data: comment,
		});
	} catch (error) {
		res.status(500).json(error.message);
	}
};

const deleteComment = async (req, res) => {
	const { id } = req.params;

	try {
		const comment = await commentModel.findById(id);
		if (!comment) return res.status(404).json({ message: "The comment is not found!" });
		if (req.userAuth.toString() !== comment.user.toString()) return res.status(403).json({ message: "Access denied! You can't delete comment by other user!" });

		const post = await postModel.findById(comment.post);
		if (!post) return res.status(404).json({ message: "The post is not found!" });
		post.comments = post.comments.filter((postComment) => postComment.toString() !== id.toString());

		await commentModel.findByIdAndDelete(id);
		await post.save();

		res.status(200).json({
			status: "success",
			data: "The comment has been deleted successfully",
		});
	} catch (error) {
		res.status(500).json(error.message);
	}
};

const updateComment = async (req, res) => {
	const { description } = req.body;

	try {
		const comment = await commentModel.findById(req.params.id);
		if (!comment) return res.status(404).json({ message: "The comment is not found!" });
		if (!description) return res.status(400).json({ message: "Input description is required!" });
		if (req.userAuth.toString() !== comment.user.toString()) return res.status(403).json({ message: "Access denied! You can't update comment by other user!" });

		await commentModel.findByIdAndUpdate(req.params.id, { description }, { new: true });

		res.status(200).json({
			status: "success",
			data: "The comment has been updated successfully",
		});
	} catch (error) {
		res.status(500).json(error.message);
	}
};

module.exports = { createComment, getComment, deleteComment, updateComment };
