const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const detailOrderProductSchema = new Schema({
    id_boothProduct: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "boothProduct",
    },
    id_detailBooth: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "detailBoothProduct",
    },
    quantity: {
        type: Number,
        required: true,
    },
    requestContent: {
        type: String,
    },
});

const detailOrderProductModel = mongoose.model(
    "detailOrderProduct",
    detailOrderProductSchema
);
module.exports = detailOrderProductModel;
