const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tokenSignUpSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    },
    token: {
        type: String,
    },
    createdAt: {
        type: Date,
    },
    validityPeriod: {
        type: Date,
    },
});

const tokenSignUpModel = mongoose.model("tokenSignUp", tokenSignUpSchema);
module.exports = tokenSignUpModel;
