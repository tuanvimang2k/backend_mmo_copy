const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const refSystemSchema = new Schema({
    level: {
        type: Number,
    },
    income: {
        type: Number,
    },
});
const refSystemModel = mongoose.model("refSystem", refSystemSchema);
module.exports = refSystemModel;
