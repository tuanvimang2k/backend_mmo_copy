const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const detailOrderServiceSchema = new Schema({
    id_boothService: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "boothService",
    },
    id_detailBooth: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "detailBoothService",
    },
    quantity: {
        type: Number,
        required: true,
    },
    requestContent: {
        type: String,
    },
});

const detailOrderServiceModel = mongoose.model(
    "detailOrderService",
    detailOrderServiceSchema
);
module.exports = detailOrderServiceModel;
