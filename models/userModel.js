const mongoose = require("mongoose");
const postModel = require("./postModel");

// Create schema
const userSchema = new mongoose.Schema(
	{
		firstName: {
			type: String,
			required: [true, "First name is required!"],
		},
		lastName: {
			type: String,
			required: [true, "Last name is required!"],
		},
		profilePhoto: {
			type: String,
			default: "",
		},
		email: {
			type: String,
			required: [true, "Email is required!"],
		},
		password: {
			type: String,
			required: [true, "First Name is required!"],
		},
		isBlocked: {
			type: Boolean,
			default: false,
		},
		isAdmin: {
			type: Boolean,
			default: false,
		},
		role: {
			type: String,
			enum: ["Admin", "Guest", "Editor"],
		},
		viewers: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
		],
		followers: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
		],
		following: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
		],
		posts: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Post",
			},
		],
		blocked: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
		],
		// plan: {
		// 	type: String,
		// 	enum: ["Free", "Premium", "Pro"],
		// 	default: "Free",
		// },
		userAward: {
			type: String,
			enum: ["Bronze", "Silver", "Gold"],
			default: "Bronze",
		},
	},
	{
		timestamps: true,
		toJSON: { virtuals: true },
	}
);

// Hooks
// 1. Pre = before record is saved (find, findOne) => /^find/
userSchema.pre("findOne", async function (next) {
	this.populate({ path: "posts" });
	const userId = this._conditions._id;
	const posts = await postModel.find({ author: userId });
	const lastPost = posts[posts.length - 1];
	const lastPostDate = new Date(lastPost?.createdAt);
	const lastPostDateStr = lastPostDate?.toDateString();

	userSchema.virtual("lastPostDate").get(function () {
		return lastPostDateStr;
	});

	// User inactive for 6 months
	const currentDate = new Date();
	const diffDate = currentDate - lastPostDate;
	const diffInDays = diffDate / (1000 * 3600 * 24);

	if (diffInDays > 180) {
		userSchema.virtual("isInactive").get(function () {
			return true;
		});

		await User.findByIdAndUpdate(
			userId,
			{
				isBlocked: true,
			},
			{ new: true }
		);
	} else {
		userSchema.virtual("isInactive").get(function () {
			return false;
		});

		// await User.findByIdAndUpdate(
		// 	userId,
		// 	{
		// 		isBlocked: false,
		// 	},
		// 	{ new: true }
		// );
	}

	// Last active date
	const daysAgo = Math.floor(diffInDays);

	userSchema.virtual("lastActive").get(function () {
		return daysAgo < 1 ? "Below 24 hours" : daysAgo < 2 ? "Below 48 hours" : `${daysAgo} days ago`;
	});

	// Update user awards based on number of posts
	const numberOfPost = posts.length;

	if (numberOfPost < 100) await User.findByIdAndUpdate(userId, { userAward: "Bronze" }, { new: true });
	else if (numberOfPost < 1000) await User.findByIdAndUpdate(userId, { userAward: "Silver" }, { new: true });
	else await User.findByIdAndUpdate(userId, { userAward: "Gold" }, { new: true });

	next();
});

// 2. Post = after saving (create, save)
// userSchema.post("save", function (next) {
// 	console.log("Post hook save");
// 	next();
// });

// Get fullname
userSchema.virtual("fullname").get(function () {
	return `${this.firstName} ${this.lastName}`;
});

// Compile the user model
const User = mongoose.model("User", userSchema);
module.exports = User;
