const mongoose = require("mongoose");

// Function to connect
const dbConnect = async () => {
	try {
		await mongoose.set("strictQuery", false);
		await mongoose.connect(process.env.MONGODB_URL);
		console.log("DB has connected successfully");
	} catch (error) {
		console.log(error.message);
		process.exit(1);
	}
};

dbConnect();
