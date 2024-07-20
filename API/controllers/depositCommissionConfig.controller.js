const depositCommissionConfigModel = require("../../models/depositCommissionConfig.model");
const userModel = require("../../models/user.model");
const depositCommissionConfigController = {
    createDeposit: async (req, res) => {
        try {
            const percent = req.body.percent;
            const newPercent = await new depositCommissionConfigModel({
                percent: percent,
            }).save();
            return res.status(200).json({
                success: true,
                data: newPercent,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    },
    updateDeposit: async (req, res) => {
        try {
            const deposit = await depositCommissionConfigModel.findOneAndUpdate(
                {
                    _id: req.params._id,
                },
                { percent: req.body.percent },
                { new: true }
            );
            return res.status(200).json({
                success: true,
                data: deposit,
                message: "Updated percent successfully.",
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    },
    getAllDeposit: async (req, res) => {
        try {
            const depositCommission = await depositCommissionConfigModel.find();
            return res.status(200).json({
                success: true,
                data: depositCommission,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    },
    getIdDepositCommission: async (req, res) => {
        try {
            const _id = req.params._id;
            const depositCommission =
                await depositCommissionConfigModel.findById(_id);
            return res.status(200).json({
                success: true,
                data: depositCommission,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    },
    rewardDepositTransactionW3: async (id_seller, usedFromW3) => {
        if (usedFromW3 > 0) {
            const findDeposit = await depositCommissionConfigModel.find();
            const update = (usedFromW3 * findDeposit[0].percent) / 100;
            // console.log("update:", update);
            const findUser = await userModel.findOneAndUpdate(
                { _id: id_seller, role: "agent" },
                {
                    $inc: {
                        totalRewardTransactionW3: update,
                    },
                },
                { new: true }
            );
            if (!findUser) {
                // console.log("++++++++++");
                return true;
            }
            console.log("updated deposit transaction w3 successfully.");
        } else {
            return false;
        }
    },
};
module.exports = depositCommissionConfigController;
