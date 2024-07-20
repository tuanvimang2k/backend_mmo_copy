const walletConfigModel = require("../../models/walletConfig.model");
const walletConfigController = {
    createWallet: async (req, res, next) => {
        try {
            const { addressWallet, name } = req.body;
            const findAddressWallet = await walletConfigModel.findOne({
                addressWallet: addressWallet,
            });
            if (findAddressWallet) {
                return res.status(409).json({
                    message: "Address wallet is existing!",
                });
            }
            const newWallet = new walletConfigModel({
                name: name,
                addressWallet: addressWallet,
            });
            const saveNewWallet = await newWallet.save();
            return res.status(200).json({
                success: true,
                data: saveNewWallet,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    },
    updateWallet: async (req, res, next) => {
        try {
            const conditionUpdateWallet = await walletConfigModel.findOne({
                _id: req.params._id,
            });
            if (!conditionUpdateWallet) {
                return res.status(404).json({
                    success: false,
                    message: "Address wallet not found!",
                });
            }
            const updatedDataWallet = {
                name: req.body.name,
                addressWallet: req.body.addressWallet,
                status: req.body.status,
            };
            //console.log("updatedDataWallet:", updatedDataWallet);
            const updateWallet = await walletConfigModel.findOneAndUpdate(
                conditionUpdateWallet,
                updatedDataWallet,
                { new: true }
            );
            return res.status(200).json({
                message: "Updated address wallet successfully!",
                data: updateWallet,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    },
    getAllWallet: async (req, res, next) => {
        try {
            const findAllWallet = await walletConfigModel.find();
            return res.status(200).json({
                success: true,
                data: findAllWallet,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    },
    deleteWallet: async (req, res, next) => {
        try {
            const findWallet = await walletConfigModel.findByIdAndDelete(
                req.params._id
            );
            if (findWallet) {
                return res.status(200).json({
                    success: true,
                    message: "The wallet is deleted!",
                });
            } else {
                return res.status(404).json({
                    success: false,
                    message: "The wallet not found!",
                });
            }
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    },
    getIdWallet: async (req, res, next) => {
        try {
            const findIdWallet = await walletConfigModel.findOne({
                _id: req.params._id,
            });
            return res.status(200).json({
                success: true,
                data: findIdWallet,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    },
};
module.exports = walletConfigController;
