const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const walletConfigSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        addressWallet: {
            type: String,
        },
        status: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);
const walletConfigModel = mongoose.model("walletConfig", walletConfigSchema);
module.exports = walletConfigModel;
