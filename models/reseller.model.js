const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const resellerSchema = new Schema(
    {
        id_user_agent: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
        },
        id_user_reseller: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
        },
        percent: {
            type: Number,
            required: true,
        },
        message: {
            type: String,
        },
        id_boothProduct: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "boothProduct",
        },
        id_boothService: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "boothService",
        },
        statusReseller: {
            type: String,
            default: "Pending",
        },
        commission: {
            type: Number,
        },
        linkReseller: {
            type: String,
        },
        id_orderProduct: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "orderProduct",
            },
        ],
        id_orderService: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "orderService",
            },
        ],
    },
    { timestamps: true }
);

// resellerSchema.pre("check", async function (next) {
//     try {
//         const reseller = this;
//         const findProduct = await boothProductModel.findOne({
//             _id: reseller.id_booth,
//         });
//         if (findProduct) {
//             reseller.populate("id_booth", "boothProduct");
//         } else {
//             reseller.populate("id_booth", "boothService");
//         }
// if(!findProduct){
//     const boothService = await boothServiceModel.findOne({_id: reseller.id_booth})

// }
//         return next();
//     } catch (error) {
//         return next(error);
//     }
// });

const resellerModel = mongoose.model("reseller", resellerSchema);
module.exports = resellerModel;
