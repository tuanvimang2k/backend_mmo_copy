const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const boothServiceSchema = new Schema(
    {
        id_businessType: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "business",
        },
        id_boothType: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "boothType",
        },
        id_user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
        },
        detailBooth: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "detailBoothService",
            },
        ],
        nameBooth: {
            type: String,
            required: true,
        },
        desc: {
            type: String,
        },
        shortDesc: {
            type: String,
            required: true,
        },
        imageBooth: {
            type: Array,
        },
        // id_review: {
        //     type: mongoose.Schema.Types.ObjectId,
        //     ref: "review",
        // },
        statusBooth: {
            type: String,
            //enum: ["Pending", "Approved", "Finished"],
            // values: ["Pending", "Approved", "Finished"],
            default: "Pending",
        },
        detailReseller: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "reseller",
            },
        ],
        statusReseller: {
            type: Boolean,
            default: false,
        },
        discountService: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "discount",
        },
    },
    { timestamps: true }
);

const boothServiceModel = mongoose.model("boothService", boothServiceSchema);
module.exports = boothServiceModel;
