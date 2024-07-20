const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const profileSchema = new Schema({
    lastName: {
        type: String,
        required: true,
    },
    firstName: {
        type: String,
        required: true,
    },
    phone: {
        type: Number,
        required: true,
    },
    imageProfile: {
        type: Array,
    },
    description: {
        type: String,
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    },
});
const profileModel = mongoose.model("profile", profileSchema);
module.exports = profileModel;
