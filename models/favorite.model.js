const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// const boothProductModel = require("../models/boothProduct.model");
// const boothServiceModel = require("../models/boothService.model");
const favoriteSchema = new Schema({
    id_user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    },
    id_boothProduct: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "boothProduct",
    },
    id_boothService: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "boothService",
    },
});

// favoriteSchema.pre("save", async function (next) {
//     try {
//         console.log(123);
//         console.log(this);
//         const favorite = this;
//         const findProduct = await boothProductModel.findOne({
//             _id: favorite.id_booth,
//         });
//console.log(123);
// if (findProduct) {
//     favorite.populate("id_booth", "boothProduct");
// } else {
//     favorite.populate("id_booth", "boothService");
// }
// if(!findProduct){
//     const boothService = await boothServiceModel.findOne({_id: reseller.id_booth})

// }
//         console.log("Hook pre('check') executed successfully.");
//         next();
//     } catch (error) {
//         next(error);
//     }
// });
// favoriteSchema.pre("find", async function (next) {
//     console.log(this);
//     const query = this;
//     const boothId = query.getQuery().id_booth;
//     const isProduct = await boothProductModel.exists({ _id: boothId });
//     if (isProduct) {
//         console.log(123);
//         query.boothType = "boothProduct";
//     } else {
//         console.log(456);
//         const isService = await boothServiceModel.exists({ _id: boothId });
//         if (isService) {
//             query.boothType = "boothService";
//         }
//     }
//     next();
// });

const favoriteModel = mongoose.model("favorite", favoriteSchema);
module.exports = favoriteModel;
