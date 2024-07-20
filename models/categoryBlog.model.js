const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const categoryBlogSchema = new Schema(
    {
        name: {
            type: String,
        },
        isActive: {
            type: Boolean,
            default: false,
        },
    },

    { timestamps: true }
);
const categoryBlogModel = mongoose.model("categoryBlog", categoryBlogSchema);
module.exports = categoryBlogModel;
