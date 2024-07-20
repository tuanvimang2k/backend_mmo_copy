const popupModel = require("../../models/popup.model");
const popupController = {
    createPopup: async (req, res) => {
        try {
            const { title, desc } = req.body;
            const listImage = req.listImage;
            const newPopup = await new popupModel({
                title: title,
                desc: desc,
                image: listImage,
            }).save();
            return res.status(200).json({
                success: true,
                data: newPopup,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    },
    updatePopup: async (req, res) => {
        try {
            const { title, desc, status } = req.body;
            let image;
            if (req.listImage) {
                image = req.listImage[0];
            }
            const updatePopup = await popupModel.findOneAndUpdate(
                {
                    _id: req.params._id,
                },
                { title: title, desc: desc, status: status, image: image },
                { new: true }
            );
            return res.status(200).json({
                success: true,
                data: updatePopup,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    },
    deletePopup: async (req, res) => {
        try {
            const _id = req.params._id;
            await popupModel.findByIdAndDelete(_id);
            return res.status(200).json({
                success: true,
                message: "Delete popup successfully.",
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    },
    allPopup: async (req, res) => {
        try {
            const findPopup = await popupModel.find();
            return res.status(200).json({
                success: true,
                data: findPopup,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    },
    popupById: async (req, res) => {
        try {
            const _id = req.params._id;
            const find = await popupModel.findById(_id);
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
};
module.exports = popupController;
