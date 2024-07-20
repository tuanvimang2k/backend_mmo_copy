const sliderMobileModel = require("../../models/sliderMobile.model");
const sliderMobileController = {
    saveSliderMobile: async (req, res) => {
        try {
            const listImage = req.listImage;
            const saveSlider = await new sliderMobileModel({
                image: listImage,
                link: req.body.link,
            }).save();
            return res.status(200).json({
                success: true,
                data: saveSlider,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    },
    updateSliderMobile: async (req, res) => {
        try {
            const _id = req.params._id;
            const { link, status } = req.body;
            let listImage;
            if (req.listImage) {
                listImage = req.listImage;
            }
            const update = await sliderMobileModel.findOneAndUpdate(
                { _id: _id },
                { link: link, image: listImage, status: status },
                { new: true }
            );
            return res.status(200).json({
                success: true,
                message: "Updated successfully.",
                data: update,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    },
    deleteSlider: async (req, res) => {
        try {
            const _id = req.params._id;
            await sliderMobileModel.findByIdAndDelete(_id);
            return res.status(200).json({
                success: true,
                message: "Delete slider mobile successfully.",
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    },
    getAllSliderMobile: async (req, res) => {
        try {
            const all = await sliderMobileModel.find();
            return res.status(200).json({
                success: true,
                data: all,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    },
    getIdSliderMobile: async (req, res) => {
        try {
            const findId = await sliderMobileModel.findById(req.params._id);
            return res.status(200).json({
                success: true,
                data: findId,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    },
};
module.exports = sliderMobileController;
