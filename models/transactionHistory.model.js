const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const transactionHistorySchema = new Schema({
    time: {
        type: Date,
        required: true,
    },
    type: {
        //recharge, purchase
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    reason: {
        type: String,
        required: true,
    },
    id_user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    },
});

const transactionHistoryModel = mongoose.model(
    "transactionHistory",
    transactionHistorySchema
);
module.exports = transactionHistoryModel;
