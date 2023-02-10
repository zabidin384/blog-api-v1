const categoryModel = require("../models/categoryModel");

const createCategory = async (req, res) => {
	const { title } = req.body;

	try {
		const category = await categoryModel.create({ title, user: req.userAuth });
		res.status(201).json({
			status: "success",
			data: category,
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const getAllCategory = async (req, res) => {
	try {
		const categories = await categoryModel.find();

		res.status(200).json({
			status: "success",
			data: categories,
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const getCategory = async (req, res) => {
	const { id } = req.params;

	try {
		if (!id) return res.status(404).json({ message: "Category not found!" });
		const category = await categoryModel.findById(id);

		if (category) {
			res.status(200).json({
				status: "success",
				data: category,
			});
		} else return res.status(404).json({ message: "Category not found!" });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const deleteCategory = async (req, res) => {
	const { id } = req.params;
	try {
		if (!id) return res.status(404).json({ message: "Category not found!" });
		await categoryModel.findByIdAndDelete(id);

		res.status(200).json({
			status: "success",
			data: "Category has been deleted successfully",
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const updateCategory = async (req, res) => {
	const { id } = req.params;
	const { title } = req.body;

	try {
		if (!id) return res.status(404).json({ message: "Category not found!" });
		if (!title) return res.status(400).json({ message: "Input title required!" });
		else await categoryModel.findByIdAndUpdate(req.params.id, { title }, { new: true, runValidators: true });

		res.status(200).json({
			status: "success",
			data: "Category has been updated successfully",
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

module.exports = { createCategory, getAllCategory, getCategory, deleteCategory, updateCategory };
