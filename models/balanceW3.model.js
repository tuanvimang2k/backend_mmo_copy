const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const balanceW3Schema = new Schema({
    id_user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    },
    balance: {
        type: Number,
        default: 0,
    },
    id_transaction: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "transaction",
        },
    ],
});

const balanceW3Model = mongoose.model("balanceW3", balanceW3Schema);
module.exports = balanceW3Model;
