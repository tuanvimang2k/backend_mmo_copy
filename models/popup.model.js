const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const popupSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    desc: {
        type: String,
        required: true,
    },
    status: {
        type: Boolean,
        default: false,
    },
    image: {
        type: Array,
    },
});
const popupModel = mongoose.model("popup", popupSchema);
module.exports = popupModel;
