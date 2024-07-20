const boothProductModel = require("../../models/boothProduct.model");
const boothServiceModel = require("../../models/boothService.model");

const statusBoothController = {
    updateStatusBooth: async (req, res) => {
        try {
            const { id_businessType, id_booth, statusBooth } = req.body;
            let updateStatus;
            if (id_businessType === process.env.ID_BUSINESS_PRODUCT) {
                updateStatus = await boothProductModel.findOneAndUpdate(
                    { _id: id_booth },
                    { statusBooth: statusBooth },
                    { new: true }
                );
            } else if (id_businessType === process.env.ID_BUSINESS_SERVICE) {
                updateStatus = await boothServiceModel.findOneAndUpdate(
                    { _id: id_booth },
                    { statusBooth: statusBooth },
                    { new: true }
                );
            } else {
                return res.status(400).json({
                    success: false,
                    message: "Invalid id_businessType value",
                });
            }
            if (!updateStatus) {
                return res.status(404).json({
                    success: false,
                    message: "Booth not found",
                });
            }
            return res.status(200).json({
                success: true,
                data: updateStatus,
                message: "Status booth update successfully.",
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    },
};
module.exports = statusBoothController;
