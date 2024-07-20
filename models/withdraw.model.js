const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const withdrawSchema = new Schema(
    {
        id_user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
        },
        amount: {
            type: Number,
            required: true,
        },
        stk: {
            type: Number,
            required: true,
        },
        nameBank: {
            type: String,
            required: true,
        },
        status: {
            type: Boolean,
            default: "Pending",
        },
    },
    {
        timestamps: true,
    }
);

const withdrawModel = mongoose.model("withdraw", withdrawSchema);
module.exports = withdrawModel;
