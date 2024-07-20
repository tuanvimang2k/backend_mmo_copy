const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const couponSchema = new Schema({
    code: {
        type: String,
        required: true,
    },
    numberPromo: {
        type: Number,
        required: true,
    },
    percent: {
        type: Number,
        required: true,
    },
    id_user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
    id_boothProduct: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "boothProduct",
    },
    id_boothService: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "boothService",
    },
    id_business: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "business",
    },
    soldQuantity: {
        type: Number,
        default: 0,
    },
    // status: {
    //     type: String,
    //     default: "Pending",
    // },
});
const couponModel = mongoose.model("coupon", couponSchema);
module.exports = couponModel;
