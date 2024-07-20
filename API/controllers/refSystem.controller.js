const refSystemModel = require("../../models/refSystem.model");

const refSystemController = {
    postRefSystem: async (req, res) => {
        try {
            const newRefSystem = new refSystemModel({
                level: req.body.level,
                income: req.body.income,
            });
            const saveRefSystem = await newRefSystem.save();
            return res.status(200).json({
                success: true,
                data: saveRefSystem,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    },
    updateRefSystem: async (req, res) => {
        try {
            const conditionRefSystem = {
                _id: req.params._id,
            };
            const updateDataRefSystem = {
                level: req.body.level,
                income: req.body.income,
            };
            const updatedRefSystem = await refSystemModel.findOneAndUpdate(
                conditionRefSystem,
                updateDataRefSystem,
                { new: true }
            );
            return res.status(200).json({
                message: "Updated refSystem successfully!",
                data: updatedRefSystem,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    },
    getIdRefSystem: async (req, res) => {
        try {
            const findIdRefSystem = await refSystemModel.findOne({
                _id: req.params._id,
            });
            return res.status(200).json({
                success: true,
                data: findIdRefSystem,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    },
    getAllRefSystem: async (req, res) => {
        try {
            const findAllRefSystem = await refSystemModel.find();
            return res.status(200).json({
                success: true,
                data: findAllRefSystem,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    },
    deleteRefSystem: async (req, res) => {
        try {
            const deleteRefSystem = await refSystemModel.findByIdAndDelete({
                _id: req.params._id,
            });
            return res.status(200).json({
                success: true,
                message: `Delete ref system with ID ${req.params._id} successfully`,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    },
};

module.exports = refSystemController;
