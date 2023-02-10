const commentModel = require("../models/commentModel");
const replyModel = require("../models/replyModel");
const userModel = require("../models/userModel");

const createReply = async (req, res) => {
	const { description } = req.body;
	const { id } = req.params;

	try {
		const author = await userModel.findById(req.userAuth);
		if (author.isBlocked) return res.status(403).json({ message: "Your account is blocked, you can't send any reply!" });

		const comment = await commentModel.findById(id);
		if (!comment) return res.status(404).json({ message: "The comment is not found!" });

		const replyCreated = await replyModel.create({ description, user: req.userAuth, comment: id });

		comment.reply.push(replyCreated);
		await comment.save();

		res.status(201).json({
			status: "success",
			data: "Reply has been created successfully",
		});
	} catch (error) {
		res.status(500).json(error.message);
	}
};

const getReply = async (req, res) => {
	try {
		const reply = await replyModel.findById(req.params.id);
		if (!reply) return res.status(404).json({ message: "The reply is not found!" });

		res.status(200).json({
			status: "success",
			data: reply,
		});
	} catch (error) {
		res.status(500).json(error.message);
	}
};

const deleteReply = async (req, res) => {
	const { id } = req.params;

	try {
		const reply = await replyModel.findById(id);
		if (!reply) return res.status(404).json({ message: "The reply is not found!" });
		if (req.userAuth.toString() !== reply.user.toString()) return res.status(403).json({ message: "Access denied! You can't delete reply by other user!" });

		const comment = await commentModel.findById(reply.comment);
		if (!comment) return res.status(404).json({ message: "The comment is not found!" });
		comment.reply = comment.reply.filter((commentReply) => commentReply.toString() !== id.toString());

		await replyModel.findByIdAndDelete(id);
		await comment.save();

		res.status(200).json({
			status: "success",
			data: "The reply has been deleted successfully",
		});
	} catch (error) {
		res.status(500).json(error.message);
	}
};

const updateReply = async (req, res) => {
	const { description } = req.body;

	try {
		const reply = await replyModel.findById(req.params.id);
		if (!reply) return res.status(404).json({ message: "The reply is not found!" });
		if (!description) return res.status(400).json({ message: "Input description is required!" });
		if (req.userAuth.toString() !== reply.user.toString()) return res.status(403).json({ message: "Access denied! You can't update reply by other user!" });

		await replyModel.findByIdAndUpdate(req.params.id, { description }, { new: true });

		res.status(200).json({
			status: "success",
			data: "The reply has been updated successfully",
		});
	} catch (error) {
		res.status(500).json(error.message);
	}
};

module.exports = { createReply, getReply, deleteReply, updateReply };
