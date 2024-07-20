const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewsSchema = new Schema(
    {
        id_boothProduct: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "boothProduct",
        },
        id_boothService: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "boothService",
        },
        id_user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
        },
        review: {
            type: String,
        },
        stars: {
            type: Number,
        },
    },
    { timestamps: true }
);

const reviewsModel = mongoose.model("reviews", reviewsSchema);
module.exports = reviewsModel;
