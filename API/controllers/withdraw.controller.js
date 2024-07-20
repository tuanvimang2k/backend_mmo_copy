const withdrawModel = require("../../models/withdraw.model");
const userModel = require("../../models/user.model");

const withdrawController = {
    saveDrawUser: async (req, res) => {
        try {
            const address = req.body.address;
            const findAddress = await userModel.findOne({ address: address });
            const id_user = findAddress._id;
            const { amount, stk, nameBank } = req.body;
            const findUser = await userModel.findOne({ _id: id_user });
            if (amount > findUser.totalReward) {
                return res.status(409).json({
                    success: false,
                    message: "Not enough balance withdraw!",
                });
            }
            const newWithdraw = new withdrawModel({
                id_user: findUser._id,
                amount: amount,
                stk: stk,
                nameBank: nameBank,
            });
            const saveDraw = await newWithdraw.save();
            const updateTotalReward = await userModel.findOneAndUpdate(
                { _id: findUser._id },
                { totalReward: findUser.totalReward - amount },
                { new: true }
            );
            return res.status(200).json({
                success: true,
                data: saveDraw,
                message: "Withdraw successfully.",
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    },
    getHistoryWithdraw: async (req, res) => {
        try {
            const id_user = req.params._id;
            if (!mongoose.Types.ObjectId.isValid(id_user)) {
                return res.status(404).json({
                    success: false,
                    message: `The user with ID ${id_user} not found!`,
                });
            }
            const historyWithdraw = await withdrawModel.find({
                id_user: id_user,
            });
            if (!historyWithdraw) {
                return res.status(404).json({
                    success: false,
                    message: `The user with ID ${id_user} not found!`,
                });
            }
            return res.status(200).json({
                success: true,
                data: historyWithdraw,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    },
    getAllHistoryWithdraw: async (req, res) => {
        try {
            const getAllHistoryWithdraw = await withdrawModel.find();
            return res.status(200).json({
                success: true,
                data: getAllHistoryWithdraw,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    },
    updateStatusWithDraw: async (req, res) => {
        try {
            const updateStatusWithDraw = await withdrawModel.findOneAndUpdate(
                { _id: req.body._id },
                { status: req.body.status },
                { new: true }
            );
            return res.status(200).json({
                success: true,
                data: updateStatusWithDraw,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    },
    getHistoryByIdWithdraw: async (req, res) => {
        try {
            const find = await withdrawModel
                .findById(req.params._id)
                .populate({ path: "id_user" });
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
module.exports = withdrawController;
