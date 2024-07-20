const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const depositCommissionConfigSchema = new Schema({
    percent: {
        type: Number,
        required: true,
    },
});
const depositCommissionConfigModel = mongoose.model(
    "depositCommissionConfig",
    depositCommissionConfigSchema
);
module.exports = depositCommissionConfigModel;
