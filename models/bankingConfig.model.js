const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bankingConfigSchema = new Schema({
    nameAccount: {
        type: String,
        required: true,
    },
    accountNumber: {
        type: Number,
        required: true,
    },
    nameBank: {
        type: String,
        required: true,
    },
    status: {
        type: Boolean,
        default: true,
    },
});

const bankingConfigModel = mongoose.model("bankingConfig", bankingConfigSchema);
module.exports = bankingConfigModel;
