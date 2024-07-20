const categoryBlogModel = require("../../models/categoryBlog.model");

const categoryBlogController = {
    getAll: async (req, res) => {
        try {
            const categories = await categoryBlogModel.find();
            res.status(200).json(categories);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    getAllActive: async (req, res) => {
        try {
            const categories = await categoryBlogModel.find({
                isActive: true,
            });
            res.status(200).json(categories);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    create: async (req, res) => {
        const category = new categoryBlogModel({
            name: req.body.name,
        });
        try {
            const newCategory = await category.save();
            res.status(201).json(newCategory);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },
    update: async (req, res) => {
        try {
            //isActive: true/false
            const category = await categoryBlogModel.findById(req.params._id);
            if (req.body.name) category.name = req.body.name;
            if (req.body.isActive) category.isActive = req.body.isActive;
            const updatedCategory = await category.save();
            res.status(200).json(updatedCategory);
        } catch (error) {
            res.status(404).json({ message: error.message });
        }
    },
    delete: async (req, res) => {
        try {
            const category = await categoryBlogModel.findById(req.params._id);
            category.isActive = false;
            await category.save();
            res.status(200).json({ message: "Category deleted successfully" });
        } catch (error) {
            res.status(404).json({ message: error.message });
        }
    },
};

module.exports = categoryBlogController;
