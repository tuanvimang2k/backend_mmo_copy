const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const inforAgentSchema = new Schema(
    {
        id_user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
        },
        facebook: {
            type: String,
            required: true,
        },
        sdt: {
            type: Number,
            required: true,
        },
    },
    { timestamps: true }
);
const inforAgentModel = mongoose.model("inforAgent", inforAgentSchema);
module.exports = inforAgentModel;
