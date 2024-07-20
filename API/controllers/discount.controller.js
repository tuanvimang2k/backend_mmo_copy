const discountModel = require("../../models/discount.model");
const boothTypeModel = require("../../models/boothType.model");
const boothProductModel = require("../../models/boothProduct.model");
const boothServiceModel = require("../../models/boothService.model");

const discountController = {
    createDiscount: async (req, res) => {
        try {
            const { id_booth_type, nameDiscount, percent } = req.body;
            //console.log(req.body);
            const nameDiscountLower = nameDiscount.toLowerCase();
            const findNameDiscount = await discountModel.findOne({
                nameDiscountLowerCase: nameDiscountLower,
            });
            //console.log("findNameDiscount:", findNameDiscount);
            if (findNameDiscount) {
                return res.status(409).json({
                    success: false,
                    message: "Name discount is existing!",
                });
            }
            const findBoothType = await boothTypeModel.findOne({
                _id: id_booth_type,
            });
            if (!findBoothType) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid booth type!",
                });
            }
            const newDiscount = new discountModel({
                id_boothType: findBoothType._id,
                nameDiscount: nameDiscount,
                nameDiscountLowerCase: nameDiscountLower,
                percent: percent,
            });
            const saveDiscount = await newDiscount.save();
            return res.status(200).json({
                success: true,
                data: saveDiscount,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    },
    updateDiscount: async (req, res) => {
        try {
            const { nameDiscount, percent } = req.body;
            const nameDiscountLowerCase = nameDiscount.toLowerCase();
            const updateDiscount = await discountModel.findByIdAndUpdate(
                req.params._id,
                {
                    nameDiscount: nameDiscount,
                    nameDiscountLowerCase: nameDiscountLowerCase,
                    percent: percent,
                },
                { new: true }
            );
            if (!updateDiscount) {
                return res.status(404).json({
                    success: false,
                    message: `Discount not found with ID: ${req.params._id}`,
                });
            }
            return res.status(200).json({
                success: true,
                message: "Discount updated successfully",
                data: updateDiscount,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    },
    getIdDiscount: async (req, res) => {
        try {
            const _id = req.params._id;
            const findIdDiscount = await discountModel.findById(_id);
            if (!findIdDiscount) {
                return res.status(404).json({
                    success: false,
                    message: `Discount with ID ${_id} not found!`,
                });
            }
            return res.status(200).json({
                success: true,
                data: findIdDiscount,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    },
    getIdDiscountByIdBoothType: async (req, res) => {
        try {
            const id = req.params._id;
            const find = await discountModel.find({ id_boothType: id });
            return res.status(200).json({
                success: true,
                data: find,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    },
    deleteDiscount: async (req, res) => {
        try {
            const _id = req.params._id;
            await discountModel.findByIdAndDelete(_id);
            return res.status(200).json({
                success: true,
                message: "Delete discount successfully!",
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    },
    filterDiscount: async (req, res) => {
        try {
            const id_business = req.query.id_business;
            const id_discount = req.query.id_discount;
            let findBooth;
            if (!id_business || !id_discount) {
                return res.status(400).json({
                    success: false,
                    message: "Missing required query parameters.",
                });
            }
            // if (id_business === process.env.ID_BUSINESS_PRODUCT) {
            //     findBooth = await boothProductModel.find({
            //         discountProduct: id_discount,
            //     });
            // } else if (id_business === process.env.ID_BUSINESS_SERVICE) {
            //     findBooth = await boothServiceModel.find({
            //         discountService: id_discount,
            //     });
            // }
            const businessProduct = process.env.ID_BUSINESS_PRODUCT;
            const businessService = process.env.ID_BUSINESS_SERVICE;
            const query = {
                [id_business === businessProduct
                    ? "discountProduct"
                    : "discountService"]: id_discount,
            };
            const model =
                id_business === businessProduct
                    ? boothProductModel
                    : boothServiceModel;
            findBooth = await model.find(query);
            return res.status(200).json({
                success: true,
                data: findBooth,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    },
};
module.exports = discountController;
