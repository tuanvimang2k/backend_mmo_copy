const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const boothTypeSchema = new Schema({
    nameBoothType: {
        type: String,
        required: true,
    },
    nameBoothTypeLowerCase: {
        type: String,
    },
    id_nameBusinessType: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "business",
    },
    status: {
        type: Boolean,
        default: true,
    },
});

const boothTypeModel = mongoose.model("boothType", boothTypeSchema);
module.exports = boothTypeModel;
