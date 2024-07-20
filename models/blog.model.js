const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const blogSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "categoryBlog",
        required: true,
    },
    image: [
        {
            type: String,
            required: true,
        },
    ],
    timestamp: {
        type: Date,
        default: Date.now,
    },
    isActive: {
        type: Boolean,
        default: false,
    },
    id_user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    },
});
const blogModel = mongoose.model("blog", blogSchema);
module.exports = blogModel;
