const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const discountSchema = new Schema({
    nameDiscount: {
        type: String,
    },
    nameDiscountLowerCase: {
        type: String,
    },
    percent: {
        type: Number,
    },
    id_boothType: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "boothType",
    },
});

const discountModel = mongoose.model("discount", discountSchema);
module.exports = discountModel;
