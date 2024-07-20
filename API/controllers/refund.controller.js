const orderProductModel = require("../../models/orderProduct.model");
const orderServiceModel = require("../../models/orderService.model");
const balanceUserModel = require("../../models/balanceUser.model");
const userModel = require("../../models/user.model");
const resellerModel = require("../../models/reseller.model");
const transactionHistoryController = require("../controllers/transactionHistory.controller");
const hrefController = require("./linkRef.controller");
const siteController = require("./siteUser.controller");
const balanceUserController = require("./balanceUser.controller");
const boothServiceModel = require("../../models/boothService.model");

const refundController = {
    refundOrders: async () => {
        const now = new Date();
        try {
            console.log("+++++++++++++++++++++");
            const orderProductFund = await orderProductModel.find({
                status: "Completed",
                refundTime: { $lte: now },
                statusRefund: false,
            });
            console.log("orderProductFund:", orderProductFund);
            const orderServiceFund = await orderServiceModel.find({
                status: "Completed",
                refundTime: { $lte: now },
                statusRefund: false,
            });
            for (const order of orderProductFund) {
                console.log("}}}}}}}}}}}}}}}}}}}}}}}}}}}");
                await refundController.processRefund(
                    order.id_seller,
                    // order.total
                    order.totalRefund
                );
                order.statusRefund = true;
                await order.save();
                //refund refSystem
                const findUser = await userModel.findOne({
                    _id: order.id_user,
                });
                console.log("findUser:", findUser);
                const updateRefSystem = await hrefController.reward(
                    findUser.gmail
                );
                console.log("updateRefSystem:", updateRefSystem);
                if (updateRefSystem.length !== 0) {
                    const update = await siteController.updateTotalReward(
                        updateRefSystem,
                        order.total
                    );
                }
                //refund reseller
                if (order.id_reseller) {
                    console.log("nnnnnnnnnnnnnnnnnnnnnnnnnn");
                    await refundController.processRefundReseller(
                        order.id_reseller,
                        order.refundReseller
                    );
                    order.isRefundReseller = true;
                    await order.save();
                } else {
                    console.log("No id_reseller for order:", order._id);
                }
            }
            for (const order of orderServiceFund) {
                console.log("{{{{{{{{{{{{{{{{{{{{{{{{{{{{{");
                await refundController.processRefund(
                    order.id_seller,
                    // order.total
                    order.totalRefund
                );
                //order.statusRefund = true;
                await order.save();
                //refund reseller
                console.log("--------------------");
                console.log("order.id_reseller:", order.id_reseller);
                if (order.id_reseller) {
                    console.log("nnnnnnnnnnnnnnnnnnnnnnnnnn");
                    await refundController.processRefundReseller(
                        order.id_reseller,
                        order.refundReseller
                    );
                    order.isRefundReseller = true;
                    await order.save();
                } else {
                    console.log("No id_reseller for order:", order._id);
                }
            }
            return true;
        } catch (error) {
            console.error("Error refunding orders:", error);
        }
    },
    processRefund: async (id_seller, total) => {
        const find = await balanceUserModel.findOne({ id_user: id_seller });
        console.log("find:", find);
        const findUserBalance = await balanceUserModel.findOneAndUpdate(
            { id_user: id_seller },
            { $inc: { balance: total } },
            { new: true }
        );
        console.log("findUserBalance:", findUserBalance);
        const findAdmin = await userModel.findOne({ role: "admin" });
        const findBalanceAdmin = await balanceUserModel.findOne({
            id_user: findAdmin._id,
        });
        const balanceAdmin = Number(findBalanceAdmin.balance) - Number(total);
        const updateBalanceAdmin = await balanceUserModel.findOneAndUpdate(
            { id_user: findAdmin._id },
            { $set: { balance: balanceAdmin } },
            { new: true }
        );
        console.log("updateBalanceAdmin:", updateBalanceAdmin);
    },
    processRefundReseller: async (id_reseller, refundReseller) => {
        const findReseller = await resellerModel.findOne({ _id: id_reseller });
        const findUserBalance = await balanceUserModel.findOneAndUpdate(
            { id_user: findReseller.id_user_reseller },
            { $inc: { balance: refundReseller } },
            { new: true }
        );
        console.log("findUserBalance:", findUserBalance);
        const findAdmin = await userModel.findOne({ role: "admin" });
        console.log(findAdmin);
        const updateBalanceAdmin = await balanceUserModel.findOneAndUpdate(
            { id_user: findAdmin._id },
            { $inc: { balance: -refundReseller } },
            { new: true }
        );
        console.log("updateBalanceAdmin:", updateBalanceAdmin);
    },
    refundFinishdayService: async () => {
        const now = new Date();
        console.log("++++++++++++++++++++++++++++++++++++++");
        try {
            const orderService = await orderServiceModel
                .find({
                    $or: [
                        { status: "Outofdate" },
                        {
                            status: "Approved",
                            timeRequiredComplete: { $lt: now },
                        },
                    ],
                })
                .populate({ path: "detail" });
            console.log("orderService:", orderService);
            for (const order of orderService) {
                const [findBooth, findUser] = await Promise.all([
                    boothServiceModel
                        .findOne({
                            _id: order.detail.id_boothService,
                        })
                        .populate({ path: "discountService" }),
                    userModel.findOne({
                        _id: order.id_seller,
                    }),
                ]);
                // const findBooth = await boothServiceModel.findOne({
                //     _id: order.detail.id_boothService,
                // });
                console.log("findBooth:", findBooth);
                // const findUser = await userModel.findOne({
                //     _id: findBooth.id_user,
                // });
                console.log("findUser:", findUser);
                console.log(findBooth.discountService.percent);
                console.log(order.total);
                const value =
                    order.total * (findBooth.discountService.percent / 100);
                console.log("value:", value);
                const checkBalance = await balanceUserController.checkBalance(
                    order.id_seller,
                    value
                );
                if (checkBalance === false) {
                    console.log("___________________________________");
                    findUser.numberExpired = findUser.numberExpired + 1;
                    // await findUser.save();
                    //Subtract balance Admin
                    order.status = "FinishExpired";
                    console.log("]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]");
                    await Promise.all([
                        await findUser.save(),
                        await order.save(),
                        balanceUserController.updateBalanceUserAdminSub(
                            order.total,
                            order.codeOrder
                        ),
                        balanceUserController.updateBalanceW3(
                            order.id_user,
                            order.codeOrder,
                            order.total
                        ),
                    ]);
                    // await balanceUserController.updateBalanceUserAdminSub(
                    //     order.total,
                    //     order.codeOrder
                    // );
                    // //Plus balance user
                    // await balanceUserController.updateBalanceW3(
                    //     order.id_user,
                    //     order.codeOrder,
                    //     order.total
                    // );
                    continue;
                }
                //Subtract balance agent
                const total =
                    Number(checkBalance.usedFromBanking) +
                    Number(checkBalance.usedFromW3);
                await Promise.all([
                    await balanceUserController.updateBalanceOrderUser(
                        order.id_seller,
                        checkBalance.usedFromW3,
                        checkBalance.usedFromBanking,
                        order.codeOrder
                    ),
                    //Plus fee balance admin
                    await balanceUserController.updateBalanceUserAdminPlus(
                        total,
                        order.codeOrder
                    ),
                    //Subtract balance Admin
                    await balanceUserController.updateBalanceUserAdminSub(
                        order.total,
                        order.codeOrder
                    ),
                    //Plus balance user
                    await balanceUserController.updateBalanceW3(
                        order.id_user,
                        order.codeOrder,
                        order.total
                    ),
                ]);
                // const updateBalanceAgent =
                //     await balanceUserController.updateBalanceOrderUser(
                //         order.id_seller,
                //         checkBalance.usedFromW3,
                //         checkBalance.usedFromBanking,
                //         order.codeOrder
                //     );
                //Plus fee balance admin
                // await balanceUserController.updateBalanceUserAdminPlus(
                //     total,
                //     order.codeOrder
                // );
                //Subtract balance Admin
                // await balanceUserController.updateBalanceUserAdminSub(
                //     order.total,
                //     order.codeOrder
                // );
                //Plus balance user
                // await balanceUserController.updateBalanceW3(
                //     order.id_user,
                //     order.codeOrder,
                //     order.total
                // );
            }
            return true;
        } catch (error) {
            console.error("Error refunding orders:", error);
        }
    },
    processRefundOutOfDateService: async (id_user) => {},
};
module.exports = refundController;
