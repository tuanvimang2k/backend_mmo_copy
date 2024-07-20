const mongoose = require("mongoose");
const boothTypeModel = require("../../models/boothType.model");

const boothTypeController = {
    createBoothType: async (req, res) => {
        try {
            const id_nameBusinessType = req.body.id_nameBusinessType;
            const nameBoothType = req.body.nameBoothType;
            const nameBoothTypeLowerCase = nameBoothType.toLowerCase();
            const findNameBoothType = await boothTypeModel.findOne({
                nameBoothTypeLowerCase: nameBoothTypeLowerCase,
            });
            if (findNameBoothType) {
                return res.status(409).json({
                    success: false,
                    message: "Name booth type is existing!",
                });
            }
            const newBoothType = await new boothTypeModel({
                nameBoothType: nameBoothType,
                nameBoothTypeLowerCase: nameBoothTypeLowerCase,
                id_nameBusinessType: id_nameBusinessType,
            });
            const saveNewBoothType = await newBoothType.save();
            return res.status(200).json({
                success: true,
                data: saveNewBoothType,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    },
    updateBoothType: async (req, res) => {
        try {
            const id_boothType = req.params._id;
            if (!mongoose.Types.ObjectId.isValid(id_boothType)) {
                return res.status("404").json({
                    success: false,
                    message: `Invalid business ID ${id_boothType}`,
                });
            }
            const nameBoothType = req.body.nameBoothType;
            const nameBoothTypeLowerCase = nameBoothType.toLowerCase();
            const id_nameBusinessType = req.body.id_nameBusinessType;
            const findNameBoothType = await boothTypeModel.findOne({
                nameBoothTypeLowerCase: nameBoothTypeLowerCase,
            });
            if (findNameBoothType) {
                return res.status(409).json({
                    success: false,
                    message: "Name booth type is existing!",
                });
            }
            const updateBoothType = await boothTypeModel.findByIdAndUpdate(
                id_boothType,
                {
                    nameBoothType: nameBoothType,
                    nameBoothTypeLowerCase: nameBoothTypeLowerCase,
                    id_nameBusinessType: id_nameBusinessType,
                },
                { new: true }
            );
            if (!updateBoothType) {
                return res.status(404).json({
                    success: false,
                    message: `Booth type not found with ID: ${id_boothType}`,
                });
            }

            return res.status(200).json({
                success: true,
                message: "Both type updated successfully",
                updatedBusiness: updateBoothType,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    },
    getAllBoothType: async (req, res) => {
        try {
            const getAllBoothType = await boothTypeModel
                .find()
                .populate({ path: "id_nameBusinessType" });
            return res.status(200).json({
                success: true,
                data: getAllBoothType,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    },
    getIdBoothType: async (req, res) => {
        try {
            const _id = req.params._id;
            if (!mongoose.Types.ObjectId.isValid(_id)) {
                return res.status("404").json({
                    success: false,
                    message: `Name booth type with id ${_id} not found!`,
                });
            }
            const findBoothType = await boothTypeModel
                .findById(_id)
                .populate({ path: "id_nameBusinessType" });
            if (!findBoothType) {
                return res.status(404).json({
                    success: false,
                    message: `Booth type with ID ${_id} not found!`,
                });
            }
            return res.status(200).json({
                success: true,
                data: findBoothType,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    },
    getBoothTypeByIdBusiness: async (req, res) => {
        try {
            const id_business = req.params._id;
            const find = await boothTypeModel.find({
                id_nameBusinessType: id_business,
            });
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
    deleteBoothType: async (req, res) => {
        try {
            const _id = req.params._id;
            await boothTypeModel.findOneAndDelete({
                _id: _id,
            });
            return res.status(200).json({
                success: true,
                message: "The booth type is deleted!",
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    },
};
module.exports = boothTypeController;
