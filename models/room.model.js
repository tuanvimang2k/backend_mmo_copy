const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const roomSchema = new Schema(
    {
        members: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "user",
            },
        ],
        totalBlock: {
            type: Number,
            default: 1,
        },
    },
    { timestamps: true }
);

const roomModel = mongoose.model("room", roomSchema);
module.exports = roomModel;
