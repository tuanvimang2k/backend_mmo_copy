const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const detailBoothProductSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    countQuantity: {
        type: Number,
        default: 0,
    },
    status: {
        type: Boolean,
        default: true,
    },
});

const detailBoothProductModel = mongoose.model(
    "detailBoothProduct",
    detailBoothProductSchema
);
module.exports = detailBoothProductModel;
