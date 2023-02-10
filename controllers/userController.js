const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");
const getTokenHeader = require("../utils/getTokenHeader");
const categoryModel = require("../models/categoryModel");
const commentModel = require("../models/commentModel");
const postModel = require("../models/postModel");
const userModel = require("../models/userModel");

const registerUser = async (req, res) => {
	const { firstName, lastName, email, password } = req.body;

	try {
		const userFound = await userModel.findOne({ email });
		if (userFound) return res.status(403).json({ message: `${email} already registered!` });

		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		await userModel.create({ firstName, lastName, email, password: hashedPassword });

		res.status(201).json({
			status: "success",
			data: `${email} has been registered successfully`,
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const loginUser = async (req, res) => {
	const { email, password } = req.body;
	try {
		const userFound = await userModel.findOne({ email });
		const isPasswordCorrect = userFound ? await bcrypt.compare(password, userFound.password) : false;

		if (!userFound || !isPasswordCorrect) return res.status(404).json({ message: "Email or password is wrong!" });

		const { firstName, lastName, isAdmin, _id } = userFound;

		res.status(200).json({
			status: "success",
			data: { firstName, lastName, email, isAdmin, token: generateToken(_id) },
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const whoViewedMyProfile = async (req, res) => {
	try {
		const userOriginal = await userModel.findById(req.params.id);
		const userWhoViewed = await userModel.findById(req.userAuth);

		if (userOriginal && userWhoViewed) {
			const isUserAlreadyViewed = userOriginal.viewers.find((viewer) => viewer.toString() == userWhoViewed._id.toString());

			if (isUserAlreadyViewed) return res.status(409).json({ message: "You already viewed this user!" });
			else {
				userOriginal.viewers.push(userWhoViewed._id);
				await userOriginal.save();

				res.status(200).json({
					status: "success",
					data: "You have successfully viewed this profile",
				});
			}
		} else return res.status(401).json({ message: "Something went wrong!" });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const followUser = async (req, res) => {
	try {
		const userToFollow = await userModel.findById(req.params.id);
		const userWhoFollowed = await userModel.findById(req.userAuth);

		if (userToFollow && userWhoFollowed) {
			const isAlreadyFollowed = userToFollow.followers.find((follower) => follower.toString() === userWhoFollowed._id.toString());

			if (isAlreadyFollowed) return res.status(409).json({ message: "The user already followed!" });
			else {
				userToFollow.followers.push(userWhoFollowed._id);
				userWhoFollowed.following.push(userToFollow._id);

				await userToFollow.save();
				await userWhoFollowed.save();

				res.status(200).json({
					status: "success",
					data: "You successfully follow the user",
				});
			}
		} else return res.status(401).json({ message: "Something went wrong!" });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const unFollowUser = async (req, res) => {
	try {
		const userToUnfollow = await userModel.findById(req.params.id);
		const userWhoUnfollowed = await userModel.findById(req.userAuth);

		if (userToUnfollow && userWhoUnfollowed) {
			const isFollowed = userToUnfollow.followers.find((follower) => follower.toString() === userWhoUnfollowed._id.toString());

			if (!isFollowed) return res.status(409).json({ message: "The user has not followed!" });
			else {
				userToUnfollow.followers = userToUnfollow.followers.filter((follower) => follower.toString() !== userWhoUnfollowed._id.toString());
				userWhoUnfollowed.following = userWhoUnfollowed.following.filter((following) => following.toString() !== userToUnfollow._id.toString());

				await userToUnfollow.save();
				await userWhoUnfollowed.save();

				res.status(200).json({
					status: "success",
					data: "You successfully unfollow the user",
				});
			}
		} else return res.status(401).json({ message: "Something went wrong!" });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const blockUser = async (req, res) => {
	try {
		const userToBlock = await userModel.findById(req.params.id);
		const userWhoBlock = await userModel.findById(req.userAuth);

		if (userToBlock && userWhoBlock) {
			const isAlreadyBlock = userWhoBlock.blocked.find((user) => user.toString() === userToBlock._id.toString());

			if (isAlreadyBlock) return res.status(409).json({ message: "The user already blocked!" });
			else {
				userWhoBlock.blocked.push(userToBlock._id);
				await userWhoBlock.save();

				res.status(200).json({
					status: "success",
					data: "You successfully blocked the user",
				});
			}
		} else return res.status(401).json({ message: "Something went wrong!" });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const unBlockUser = async (req, res) => {
	try {
		const userToUnblock = await userModel.findById(req.params.id);
		const userWhoUnblock = await userModel.findById(req.userAuth);

		if (userToUnblock && userWhoUnblock) {
			const isBlock = userWhoUnblock.blocked.find((user) => user.toString() === userToUnblock._id.toString());

			if (!isBlock) return res.status(409).json({ message: "You are not block the user!" });
			else {
				userWhoUnblock.blocked = userWhoUnblock.blocked.filter((user) => user.toString() !== userToUnblock._id.toString());
				await userWhoUnblock.save();

				res.status(200).json({
					status: "success",
					data: "You successfully unblock the user",
				});
			}
		} else return res.status(401).json({ message: "Something went wrong!" });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const adminBlock = async (req, res) => {
	try {
		const userToBlock = await userModel.findById(req.params.id);
		if (!userToBlock) return res.status(404).json({ message: "User is not found!" });

		userToBlock.isBlocked = true;
		await userToBlock.save();

		res.status(200).json({
			status: "success",
			data: "admin successfully block the user",
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const adminUnblock = async (req, res) => {
	try {
		const userToUnblock = await userModel.findById(req.params.id);
		if (!userToUnblock) return res.status(404).json({ message: "User is not found!" });

		userToUnblock.isBlocked = false;
		await userToUnblock.save();

		res.status(200).json({
			status: "success",
			data: "admin successfully unblock the user",
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const getUser = async (req, res) => {
	try {
		const user = await userModel.findById(req.userAuth);
		if (!user) return res.status(404).json({ message: "User not found!" });

		res.status(200).json({
			status: "success",
			data: user,
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const getAllUser = async (req, res) => {
	try {
		const users = await userModel.find();
		res.status(200).json({
			status: "success",
			data: users,
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const updateUser = async (req, res) => {
	const { email } = req.body;

	try {
		if (email) {
			const emailTaken = await userModel.findOne({ email });

			if (emailTaken) return res.status(403).json({ message: "The email has been use by other!" });
		}
		await userModel.findByIdAndUpdate(req.userAuth, req.body, { new: true, runValidators: true });

		res.status(200).json({
			status: "success",
			data: "User has been updated successfully",
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const updatePassword = async (req, res) => {
	const { password } = req.body;
	try {
		if (password) {
			const salt = await bcrypt.genSalt(10);
			const hashedPassword = await bcrypt.hash(password, salt);

			await userModel.findByIdAndUpdate(req.userAuth, { password: hashedPassword }, { new: true, runValidators: true });

			res.status(200).json({
				status: "success",
				data: "Password has been updated successfully",
			});
		} else return res.status(400).json({ message: "Input password required!" });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const deleteAccount = async (req, res) => {
	try {
		const userToDelete = await userModel.findById(req.userAuth);

		await postModel.deleteMany({ user: req.userAuth });
		await commentModel.deleteMany({ user: req.userAuth });
		await categoryModel.deleteMany({ user: req.userAuth });
		await userToDelete.delete();

		res.status(200).json({
			status: "success",
			data: "Your account has been deleted successfully",
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const uploadProfilePhoto = async (req, res) => {
	try {
		const userToUpdate = await userModel.findById(req.userAuth);
		if (!userToUpdate) return res.status(404).json({ message: "Your account is not found!" });
		if (userToUpdate.isBlocked) return res.status(403).json({ message: "Your account is blocked!" });

		if (req.file) {
			await userModel.findByIdAndUpdate(
				req.userAuth,
				{
					$set: {
						profilePhoto: req.file.path,
					},
				},
				{ new: true }
			);
			res.status(200).json({
				status: "success",
				data: "Profile photo has been updated successfully",
			});
		}
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

module.exports = {
	registerUser,
	loginUser,
	getUser,
	getAllUser,
	updateUser,
	updatePassword,
	uploadProfilePhoto,
	whoViewedMyProfile,
	followUser,
	unFollowUser,
	blockUser,
	unBlockUser,
	adminBlock,
	adminUnblock,
	deleteAccount,
};
