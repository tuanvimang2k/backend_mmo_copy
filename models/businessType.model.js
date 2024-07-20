const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const businessTypeSchema = new Schema({
    nameBusiness: {
        type: String,
        unique: true,
        required: true,
    },
    nameBusinessLowerCase: {
        type: String,
    },
    status: {
        type: Boolean,
        default: true,
    },
});

const businessTypeModel = mongoose.model("business", businessTypeSchema);
module.exports = businessTypeModel;
