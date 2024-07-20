const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const balanceSchema = new Schema({
    id_user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    },
    balance: {
        type: Number,
        default: 0,
    },
});

const balanceModel = mongoose.model("balance", balanceSchema);
module.exports = balanceModel;
