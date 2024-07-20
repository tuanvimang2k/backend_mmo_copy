const bankingConfigModel = require("../../models/bankingConfig.model");

const bankingConfigController = {
    //Banking không cho thêm chỉ cho sửa
    saveBanking: async (req, res) => {
        try {
            const { accountNumber, nameAccount, nameBank } = req.body;
            const newBanking = new bankingConfigModel({
                accountNumber: accountNumber,
                nameAccount: nameAccount,
                nameBank: nameBank,
            });
            const saveBanking = await newBanking.save();
            return res.status(200).json({
                success: true,
                data: saveBanking,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    },
    updateBanking: async (req, res) => {
        try {
            const { accountNumber, nameAccount, nameBank, status } = req.body;
            const _id = req.params._id;
            const updateBanking = await bankingConfigModel.findOneAndUpdate(
                { _id: _id },
                {
                    accountNumber: accountNumber,
                    nameAccount: nameAccount,
                    nameBank: nameBank,
                    status: status,
                },
                { new: true }
            );
            return res.status(200).json({
                success: true,
                data: updateBanking,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    },
    getIdBanking: async (req, res) => {
        try {
            const findBanking = await bankingConfigModel.findById(
                req.params._id
            );
            return res.status(200).json({
                success: true,
                data: findBanking,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    },
    getAllBanking: async (req, res) => {
        try {
            const findBanking = await bankingConfigModel.find();
            return res.status(200).json({
                success: true,
                data: findBanking,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    },
    deleteBankingConfig: async (req, res) => {
        try {
            await bankingConfigModel.findByIdAndDelete(req.params._id);
            return res.status(200).json({
                success: true,
                message: "Delete wallet config successfully!",
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    },
};
module.exports = bankingConfigController;
