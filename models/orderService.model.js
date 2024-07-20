const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderServiceSchema = new Schema(
    {
        id_user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
        },
        codeCoupon: {
            type: String,
        },
        detail: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "detailOrderService",
        },
        total: {
            type: Number,
        },
        totalRefund: {
            type: Number,
        },
        finishDay: {
            type: Number,
            required: true,
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
        timeApproved: {
            type: Date,
        },
        timeRequiredComplete: {
            type: Date,
        },
        // numberExpired: {
        //     type: Number,
        // },
    },
    {
        timestamps: true,
    }
);
const orderServiceModel = mongoose.model("orderService", orderServiceSchema);
module.exports = orderServiceModel;
