const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const chatSchema = new Schema(
    {
        roomId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "room",
        },
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
        },
        content: {
            type: String,
        },
        block: {
            type: Number,
        },
    },
    { timestamps: true }
);

const chatModel = mongoose.model("chat", chatSchema);
module.exports = chatModel;
