const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const express = require("express");
const blogRouter = express.Router();
const firebaseMiddleware = require("../../middlewares/firebase.middleware");
const blogController = require("../controllers/blog.controller");
const conditionalMiddleware = require("../../middlewares/conditional.middleware");
blogRouter.post(
    "/api/save/blog",
    upload.array("image", 10),
    firebaseMiddleware.uploadMultipleImages,
    blogController.create
);
blogRouter.get("/api/all/blog", blogController.getAll);
blogRouter.get("/api/all/active", blogController.getAllActive);
blogRouter.put(
    "/api/update/blog/:_id",
    upload.array("image", 10),
    conditionalMiddleware(firebaseMiddleware.uploadMultipleImages),
    blogController.update
);
blogRouter.delete("/api/delete/blog/:_id", blogController.delete);
blogRouter.get("/api/get/user/:_id", blogController.getAllBlogUser);
blogRouter.get("/api/detail/blog/:_id", blogController.detailBlog);

module.exports = blogRouter;