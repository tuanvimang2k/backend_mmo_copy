const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderProductSchema = new Schema(
    {
        id_user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
        },
        codeCoupon: {
            // type: String,
            type: mongoose.Schema.Types.ObjectId,
            ref: "coupon",
        },
        detail: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "detailOrderProduct",
        },
        total: {
            type: Number,
        },
        totalRefund: {
            type: Number,
        },
        status: {
            type: String,
            default: "Pending",
        },
        id_business: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "business",
        },
        codeOrder: {
            type: String,
            required: true,
        },
        contentDelivery: {
            type: String,
        },
        contentCancel: {
            type: String,
        },
        // requestContent: {
        //     type: String,
        // },
        completeTimeOrder: {
            type: Date,
        },
        refundTime: {
            type: Date,
        },
        statusRefund: {
            type: Boolean,
            default: false,
        },
        id_seller: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
        },
        id_reseller: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "reseller",
        },
        timeRefundReseller: {
            type: Date,
        },
        refundReseller: {
            type: Number,
        },
        isRefundReseller: {
            type: Boolean,
            // default: false,
        },
        contentComplain: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);
const orderProductModel = mongoose.model("orderProduct", orderProductSchema);
module.exports = orderProductModel;
