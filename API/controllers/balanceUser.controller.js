const balanceUserModel = require("../../models/balanceUser.model");
const balanceW3Model = require("../../models/balanceW3.model");
const transactionModel = require("../../models/transaction.model");
const userModel = require("../../models/user.model");
const transactionHistoryController = require("../controllers/transactionHistory.controller");

const balanceUserController = {
    startBalanceUser: async (id) => {
        const startBalanceUser = new balanceUserModel({
            id_user: id,
            balance: 0,
        });
        console.log("startBalanceUser:", startBalanceUser);
        await startBalanceUser.save();
        //
        const startBalanceW3 = new balanceW3Model({
            id_user: id,
            balance: 0,
        });
        await startBalanceW3.save();
    },
    updateBalanceBanking: async (req, res) => {
        try {
            const id_user = req.params._id;
            const nameBank = req.body.nameBank;
            const balance = parseFloat(req.body.balance);
            const user = await balanceUserModel.findOne({ id_user: id_user });
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "User not found",
                });
            }
            const updatedBalance = parseFloat(user.balance) + balance;
            user.balance = updatedBalance;
            const newBalance = await user.save();
            //save history
            const reasonTrans = `Deposit from ${nameBank}`;
            await transactionHistoryController.saveTransactionRecharge(
                balance,
                id_user,
                reasonTrans
            );
            //
            return res.status(200).json({
                success: true,
                data: newBalance,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    },
    updateBalanceW3: async (req, res) => {
        try {
            console.log("=============");
            const id_user = await balanceW3Model.findOne({
                id_user: req.params._id,
            });
            const { from, to, value, transactionHash, balance, ecosystem } =
                req.body;
            if (!id_user) {
                return res.status(404).json({
                    success: false,
                    message: "User not found",
                });
            }
            const updatedBalance =
                parseFloat(id_user.balance) + parseFloat(balance);
            const newTransaction = await new transactionModel({
                from: from,
                to: to,
                value: value,
                transactionHash: transactionHash,
            }).save();
            console.log("newTransaction:", newTransaction);
            id_user.balance = updatedBalance;
            id_user.id_transaction.push(newTransaction._id);
            const newBalanceW3 = await id_user.save();
            //save history
            const reasonTrans = `Deposit from ${ecosystem}`;
            await transactionHistoryController.saveTransactionRecharge(
                balance,
                id_user.id_user,
                reasonTrans
            );
            //
            return res.status(200).json({
                success: true,
                data: newBalanceW3,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    },
    checkBalance: async (id_user, value) => {
        const findBalanceW3 = await balanceW3Model.findOne({
            id_user: id_user,
        });
        console.log("findBalanceW3:", findBalanceW3);
        const findUserBalanceBanking = await balanceUserModel.findOne({
            id_user: id_user,
        });
        console.log("findUserBalanceBanking:", findUserBalanceBanking);
        const sumBalance =
            parseFloat(findBalanceW3.balance) +
            parseFloat(findUserBalanceBanking.balance);
        console.log("sumBalance:", sumBalance);
        if (
            findBalanceW3.balance >= value ||
            findUserBalanceBanking.balance >= value ||
            sumBalance >= value
        ) {
            let usedFromW3 = 0;
            let usedFromBanking = 0;
            if (findBalanceW3.balance >= value) {
                usedFromW3 = value;
                usedFromBanking = 0;
            } else {
                usedFromW3 = findBalanceW3.balance;
                usedFromBanking = value - findBalanceW3.balance;
            }
            return { usedFromW3, usedFromBanking };
        } else {
            return false;
        }
    },
    updateBalanceOrderUser: async (
        id_user,
        usedFromW3,
        usedFromBanking,
        codeOrder
    ) => {
        const updateBalanceUser = await Promise.all([
            balanceUserModel.bulkWrite([
                {
                    updateOne: {
                        filter: { id_user },
                        update: { $inc: { balance: -usedFromBanking } },
                    },
                },
            ]),
            balanceW3Model.bulkWrite([
                {
                    updateOne: {
                        filter: { id_user },
                        update: { $inc: { balance: -usedFromW3 } },
                    },
                },
            ]),
        ]);
        await transactionHistoryController.saveTransactionBuy(
            usedFromW3,
            id_user,
            codeOrder
        );
        await transactionHistoryController.saveTransactionBuy(
            usedFromBanking,
            id_user,
            codeOrder
        );
        console.log("Balances update successfully.");
    },
    getAllBalance: async (req, res) => {
        try {
            const findUser = await userModel.find();
            const balanceUser = await Promise.all(
                findUser.map(async (user) => {
                    const [balanceW3, balanceBanking] = await Promise.all([
                        balanceUserModel.findOne({ id_user: user._id }),
                        balanceW3Model.findOne({ id_user: user._id }),
                    ]);
                    return {
                        user: user,
                        balanceW3: balanceW3,
                        balanceBanking: balanceBanking,
                    };
                })
            );
            return res.status(200).json({
                success: true,
                data: balanceUser,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    },
    getBalanceByIdUser: async (req, res) => {
        try {
            const _id = req.params._id;
            const [balanceBanking, balanceWeb3] = await Promise.all([
                balanceUserModel
                    .findOne({ id_user: _id })
                    .populate({ path: "id_user" }),
                balanceW3Model
                    .findOne({ id_user: _id })
                    .populate({ path: "id_transaction" }),
            ]);
            return res.status(200).json({
                success: true,
                data: {
                    balanceBanking: balanceBanking,
                    balanceWeb3: balanceWeb3,
                },
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    },
    updateBalanceW3: async (id_user, codeOrder, total) => {
        // const findAdmin = await userModel.findOne({role: 'admin'})
        const updateBalanceW3 = await balanceW3Model.findOneAndUpdate(
            { id_user: id_user },
            { $inc: { balance: total } },
            { new: true }
        );
        // const updateAdmin = await balanceUserModel.findOneAndUpdate({id_user: findAdmin._id},)

        //save history
        const reasonTrans = `Refund for order ${codeOrder}`;
        await transactionHistoryController.saveTransactionRecharge(
            total,
            id_user,
            reasonTrans
        );
    },
    updateBalanceUserAdminPlus: async (total, codeOrder) => {
        const findAdmin = await userModel.findOne({ role: "admin" });
        await balanceUserModel.findOneAndUpdate(
            { id_user: findAdmin._id },
            { $inc: { balance: total } },
            { new: true }
        );
        const reasonTrans = `Refund for fee order ${codeOrder}`;
        await transactionHistoryController.saveTransactionRecharge(
            total,
            findAdmin._id,
            reasonTrans
        );
    },
    updateBalanceUserAdminSub: async (total, codeOrder) => {
        const findAdmin = await userModel.findOne({ role: "admin" });
        await balanceUserModel.findOneAndUpdate(
            { id_user: findAdmin._id },
            { $inc: { balance: -total } },
            { new: true }
        );
        // const reasonTrans = `Refund for fee order ${codeOrder}`;
        await transactionHistoryController.saveTransactionBuy(
            total,
            findAdmin._id,
            codeOrder
        );
    },
};
module.exports = balanceUserController;
