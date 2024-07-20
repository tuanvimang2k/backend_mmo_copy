const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const affiliateSchema = new Schema({
    userGrand: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    },
    userChild: {
        // type: mongoose.Schema.Types.ObjectId,
        // ref: "user",
        type: String,
    },
});
const affiliateModel = mongoose.model("affiliate", affiliateSchema);
module.exports = affiliateModel;
