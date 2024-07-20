const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const sliderMobileSchema = new Schema(
    {
        image: {
            type: Array,
        },
        link: {
            type: String,
        },
        status: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

const sliderMobileModel = mongoose.model("sliderMobile", sliderMobileSchema);
module.exports = sliderMobileModel;
