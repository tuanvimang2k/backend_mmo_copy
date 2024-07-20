const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const transactionSchema = new Schema({
    from: {
        type: String,
        required: true,
    },
    to: {
        type: String,
        required: true,
    },
    value: {
        type: Number,
        required: true,
    },
    transactionHash: {
        type: String,
        required: true,
    },
});

const transactionModel = mongoose.model("transaction", transactionSchema);
module.exports = transactionModel;
