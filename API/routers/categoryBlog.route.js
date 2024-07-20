const express = require("express");
const categoryBlogRouter = express.Router();
const categoryBlogController = require("../controllers/categoryBlog.controller");

categoryBlogRouter.get("/api/all/category/blog", categoryBlogController.getAll);
categoryBlogRouter.get(
    "/api/category/active",
    categoryBlogController.getAllActive
);
categoryBlogRouter.post("/api/save/category", categoryBlogController.create);
categoryBlogRouter.put(
    "/api/category/update/:_id",
    categoryBlogController.update
);
categoryBlogRouter.delete(
    "/api/category/delete/:_id",
    categoryBlogController.delete
);

module.exports = categoryBlogRouter;
