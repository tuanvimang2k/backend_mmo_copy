const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const detailBoothServiceSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
    },
    // dayCompleted: {
    //     type: Number,
    // },
    status: {
        type: Boolean,
        default: true,
    },
});
const detailBoothServiceModel = mongoose.model(
    "detailBoothService",
    detailBoothServiceSchema
);
module.exports = detailBoothServiceModel;
