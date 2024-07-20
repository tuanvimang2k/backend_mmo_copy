const mongoose = require("mongoose");
const businessTypeModel = require("../../models/businessType.model");

const businessTypeController = {
    createBusinessType: async (req, res) => {
        try {
            const nameBusiness = req.body.nameBusiness;
            const nameBusinessLowerCase = nameBusiness.toLowerCase();
            const findNameBusiness = await businessTypeModel.findOne({
                nameBusinessLowerCase: nameBusinessLowerCase,
            });
            if (findNameBusiness) {
                return res.status(409).json({
                    success: false,
                    message: "Name business is existing!",
                });
            }
            const newBusinessType = await new businessTypeModel({
                nameBusiness: nameBusiness,
                nameBusinessLowerCase: nameBusinessLowerCase,
            });
            const saveNewBusiness = await newBusinessType.save();
            return res.status(200).json({
                success: true,
                data: saveNewBusiness,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    },
    updateBusinessType: async (req, res) => {
        try {
            if (!mongoose.Types.ObjectId.isValid(req.params._id)) {
                return res.status("404").json({
                    success: false,
                    message: `Invalid business ID ${req.params._id}`,
                });
            }
            const nameBusiness = req.body.nameBusiness;
            const nameBusinessLowerCase = nameBusiness.toLowerCase();
            const findNameBusiness = await businessTypeModel.findOne({
                nameBusinessLowerCase: nameBusinessLowerCase,
            });
            if (findNameBusiness) {
                return res.status(409).json({
                    success: false,
                    message: "Name business is existing!",
                });
            }
            const updateBusinessType =
                await businessTypeModel.findByIdAndUpdate(
                    req.params._id,
                    {
                        nameBusiness: req.body.nameBusiness,
                        nameBusinessLowerCase: nameBusinessLowerCase,
                    },
                    { new: true }
                );
            if (!updateBusinessType) {
                return res.status(404).json({
                    success: false,
                    message: `Business not found with ID: ${req.params._id}`,
                });
            }

            return res.status(200).json({
                success: true,
                message: "Business updated successfully",
                updatedBusiness: updateBusinessType,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    },
    getAllBusinessType: async (req, res) => {
        try {
            const findAllBusinessType = await businessTypeModel.find();
            return res.status(200).json({
                success: true,
                data: findAllBusinessType,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    },
    getIdBusinessType: async (req, res) => {
        try {
            const _id = req.params._id;
            if (!mongoose.Types.ObjectId.isValid(_id)) {
                return res.status("404").json({
                    success: false,
                    message: `Name business with id ${_id} not found!`,
                });
            }
            const findBusinessType = await businessTypeModel.findById(_id);
            if (!findBusinessType) {
                return res.status(404).json({
                    success: false,
                    message: `Business with ID ${_id} not found!`,
                });
            }
            return res.status(200).json({
                success: true,
                data: findBusinessType,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    },
};

module.exports = businessTypeController;
