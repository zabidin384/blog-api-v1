const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// Configure cloudinary
cloudinary.config({
	cloud_name: process.env.CLOUD_NAME,
	api_key: process.env.CLOUD_API_KEY,
	api_secret: process.env.CLOUD_API_SECRET,
});

// Instance of cloudinary storage
const storage = new CloudinaryStorage({
	cloudinary,
	allowedFormats: ["jpg", "jpeg", "png"],
	params: {
		folder: "blog-api",
		transformation: [{ width: 500, height: 500, crop: "limit" }],
	},
});

module.exports = storage;
