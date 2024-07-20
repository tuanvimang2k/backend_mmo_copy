const blogModel = require("../../models/blog.model");

const blogController = {
    getAll: async (req, res) => {
        try {
            const blogs = await blogModel
                .find()
                .populate([{ path: "id_user" }, { path: "category" }]);
            res.status(200).json(blogs);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    getAllActive: async (req, res) => {
        try {
            const blogs = await blogModel
                .find({ isActive: true })
                .populate([{ path: "id_user" }, { path: "category" }]);
            res.status(200).json(blogs);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    create: async (req, res) => {
        const listImage = req.listImage;
        const blog = new blogModel({
            id_user: req.body.id_user,
            title: req.body.title,
            content: req.body.content,
            category: req.body.category,
            image: listImage,
        });
        try {
            const newBlog = await blog.save();
            res.status(201).json(newBlog);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },
    update: async (req, res) => {
        try {
            const { title, content, category, image, isActive } = req.body;
            const listImage = req.listImage;
            const blog = await blogModel.findById(req.params._id);
            if (req.body.title) blog.title = title;
            if (req.body.content) blog.content = content;
            if (req.body.category) blog.category = category;
            if (req.listImage) blog.image = listImage;
            if (req.body.isActive) blog.isActive = isActive;
            const updatedBlog = await blog.save();
            res.status(200).json(updatedBlog);
        } catch (error) {
            res.status(404).json({ message: error.message });
        }
    },
    delete: async (req, res) => {
        try {
            const blog = await blogModel.findById(req.params._id);
            blog.isActive = false;
            await blog.save();
            res.status(200).json({ message: "Blog deleted successfully" });
        } catch (error) {
            res.status(404).json({ message: error.message });
        }
    },
    getAllBlogUser: async (req, res) => {
        try {
            const find = await blogModel
                .find({ id_user: req.params._id })
                .populate([{ path: "id_user" }, { path: "category" }]);
            return res.status(200).json({
                success: true,
                data: find,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    },
    detailBlog: async (req, res) => {
        try {
            const detail = await blogModel
                .findOne({ _id: req.params._id })
                .populate({ path: "id_user" });
            return res.status(200).json({
                success: true,
                data: detail,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    },
};

module.exports = blogController;
