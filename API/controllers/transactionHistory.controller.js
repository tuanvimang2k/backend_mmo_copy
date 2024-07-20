const transactionHistoryModel = require("../../models/transactionHistory.model");

const transactionHistoryController = {
    saveTransactionBuy: async (amount, id_user, codeOrder) => {
        await new transactionHistoryModel({
            time: new Date(),
            type: "purchase",
            amount: amount,
            reason: `Pay for the order ${codeOrder}`,
            id_user: id_user,
        }).save();
        return true;
    },
    saveTransactionRecharge: async (amount, id_user, reason) => {
        //reason: 'Deposit from..'
        await new transactionHistoryModel({
            time: new Date(),
            type: "recharge",
            amount: amount,
            reason: reason,
            id_user: id_user,
        }).save();
        return true;
    },
    getAllTransactionByUser: async (req, res) => {
        try {
            const allTransactionByUser = await transactionHistoryModel.find({
                id_user: req.params._id,
            });
            return res.status(200).json({
                success: true,
                data: allTransactionByUser,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    },
};
module.exports = transactionHistoryController;
