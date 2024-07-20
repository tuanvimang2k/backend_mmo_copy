const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const contactSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
    sdt: {
        type: Number,
        required: true,
    },
    topic: {
        type: String,
    },
    content: {
        type: String,
    },
    //status: pending, finish
    status: {
        type: String,
        default: "Pending",
    },
});

const contactModel = mongoose.model("contact", contactSchema);
module.exports = contactModel;
