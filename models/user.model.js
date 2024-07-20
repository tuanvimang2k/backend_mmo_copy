const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        username: {
            type: String,
            unique: true,
        },
        gmail: {
            type: String,
            unique: true,
        },
        password: {
            type: String,
            min: 6,
            max: 20,
        },
        status: {
            type: Boolean,
            default: true,
        },
        role: {
            type: String,
        },
        refreshToken: {
            type: String,
        },
        linkRef: {
            type: String,
        },
        totalRewardOrder: {
            type: Number,
            default: 0,
        },
        verify: {
            type: Boolean,
            default: false,
        },
        method: {
            type: String,
            // required: true,
        },
        totalRewardTransactionW3: {
            type: Number,
            default: 0,
        },
        numberExpired: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

const userModel = mongoose.model("user", userSchema);
module.exports = userModel;
