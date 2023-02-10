const postModel = require("../models/postModel");
const userModel = require("../models/userModel");

const createPost = async (req, res) => {
	const { title, description, category } = req.body;
	try {
		const author = await userModel.findById(req.userAuth);
		if (author.isBlocked) return res.status(403).json({ message: "Your account is blocked, you can't send any post!" });

		const postCreated = await postModel.create({ title, description, category, author: req.userAuth, photo: req?.file?.path });
		author.posts.push(postCreated);
		await author.save();

		res.status(201).json({
			status: "success",
			data: "Post has been created successfully",
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const getPost = async (req, res) => {
	try {
		const post = await postModel.findById(req.params.id);
		if (!post) return res.status(404).json({ message: "Post not found!" });

		if (post.author.toString() !== req.userAuth.toString()) {
			if (!post.numViews.includes(req.userAuth)) post.numViews.push(req.userAuth);
		}

		await post.save();

		res.status(200).json({
			status: "success",
			data: post,
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const getAllPost = async (req, res) => {
	try {
		const posts = await postModel.find({}).populate("author").populate("category", "title");
		const filteredPosts = posts.filter((post) => {
			const blockedUsers = post.author.blocked;
			const isBlocked = blockedUsers.includes(req.userAuth);

			// return isBlocked ? null : post;
			return !isBlocked;
		});

		res.status(200).json({
			status: "success",
			data: filteredPosts,
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const deletePost = async (req, res) => {
	const { id } = req.params;

	try {
		const post = await postModel.findById(id);
		if (!post) return res.status(404).json({ message: "The post is not found!" });
		if (req.userAuth.toString() !== post.author.toString()) return res.status(403).json({ message: "Access denied! You can't delete post by other user!" });

		const user = await userModel.findById(req.userAuth);
		user.posts = user.posts.filter((userPost) => userPost._id !== id);

		await postModel.findByIdAndDelete(id);
		await user.save();

		res.status(200).json({
			status: "success",
			data: "The post has been deleted successfully",
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const updatePost = async (req, res) => {
	const { title, description, category } = req.body;

	try {
		const post = await postModel.findById(req.params.id);
		if (!post) return res.status(404).json({ message: "The post is not found!" });
		if (req.userAuth.toString() !== post.author.toString()) return res.status(403).json({ message: "Access denied! You can't update post by other user" });

		await postModel.findByIdAndUpdate(req.params.id, { title, description, category, photo: req?.file?.path }, { new: true });

		res.status(200).json({
			status: "success",
			data: "The post has been updated successfully",
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const likePostToggle = async (req, res) => {
	try {
		const post = await postModel.findById(req.params.id);
		const isDislike = post.disLikes.includes(req.userAuth);
		const isAlreadyLike = post.likes.includes(req.userAuth);

		if (isDislike) post.disLikes = post.disLikes.filter((dislike) => dislike.toString() !== req.userAuth.toString());

		if (isAlreadyLike) {
			post.likes = post.likes.filter((like) => like.toString() !== req.userAuth.toString());
			await post.save();
		} else {
			post.likes.push(req.userAuth);
			await post.save();
		}

		res.status(200).json({
			status: "success",
			data: `Successfully ${isAlreadyLike ? "unlike" : "like"} the post`,
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const disLikePostToggle = async (req, res) => {
	try {
		const post = await postModel.findById(req.params.id);
		const isLike = post.likes.includes(req.userAuth);
		const isAlreadyDislike = post.disLikes.includes(req.userAuth);

		if (isLike) post.likes = post.likes.filter((like) => like.toString() !== req.userAuth.toString());

		if (isAlreadyDislike) {
			post.disLikes = post.disLikes.filter((dislike) => dislike.toString() !== req.userAuth.toString());
			await post.save();
		} else {
			post.disLikes.push(req.userAuth);
			await post.save();
		}

		res.status(200).json({
			status: "success",
			data: `Successfully ${isAlreadyDislike ? "undislike" : "dislike"} the post`,
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

module.exports = { createPost, getPost, getAllPost, deletePost, updatePost, likePostToggle, disLikePostToggle };
