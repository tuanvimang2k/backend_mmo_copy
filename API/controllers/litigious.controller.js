const schedule = require("node-schedule");
const orderProductModel = require("../../models/orderProduct.model");
const orderServiceModel = require("../../models/orderService.model");
const balanceUserController = require("./balanceUser.controller");
const litigiousController = {
    updateStatusComplain: async (req, res) => {
        try {
            const { id_business, id_order, contentComplain } = req.body;
            if (id_business === process.env.ID_BUSINESS_PRODUCT) {
                const find = await orderProductModel.findOneAndUpdate(
                    { _id: id_order },
                    { status: "complain", contentComplain: contentComplain },
                    { new: true }
                );
                if (find) {
                    //const find = await orderProductModel.findOne({_id: id_order})
                    const refundTime = new Date(
                        Date.now() + 72 * 60 * 60 * 1000
                    );
                    // Date.now() + 72 * 60 * 60 * 1000;
                    // Date.now() + 1 * 60 * 1000;
                    schedule.scheduleJob(refundTime, async () => {
                        console.log("++++++++++++++++++");
                        const update =
                            await litigiousController.refundProcessing(
                                id_order,
                                id_business
                            );
                        console.log("done!");
                    });
                }
            } else if (id_business === process.env.ID_BUSINESS_SERVICE) {
                const find = await orderServiceModel.findOneAndUpdate(
                    { _id: id_order },
                    { status: "complain", contentComplain: contentComplain },
                    { new: true }
                );
                if (find) {
                    //const find = await orderProductModel.findOne({_id: id_order})
                    const refundTime = new Date(
                        Date.now() + 72 * 60 * 60 * 1000
                    );
                    // Date.now() + 72 * 60 * 60 * 1000;
                    //Date.now() + 1 * 60 * 1000;
                    schedule.scheduleJob(refundTime, async () => {
                        console.log("++++++++++++++++++");
                        const update =
                            await litigiousController.refundProcessing(
                                id_order,
                                id_business
                            );
                        console.log("done!");
                    });
                }
            }
            return res.status(200).json({
                success: true,
                message: "Updated status order successfully.",
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    },
    refundLitigious: async (req, res) => {
        try {
            const { id_order, id_business } = req.body;
            if (id_business === process.env.ID_BUSINESS_PRODUCT) {
                const findOrder = await orderProductModel
                    .findOne({ _id: id_order })
                    .populate({
                        path: "detail",
                        populate: {
                            path: "id_boothProduct",
                            populate: { path: "discountProduct" },
                        },
                    });
                const percentOrder =
                    findOrder.detail.id_boothProduct.discountProduct.percent;
                console.log("percent:", percentOrder);
                const totalOrder = findOrder.total;
                console.log("totalOrder:", totalOrder);
                const fee = (totalOrder * percentOrder) / 100;
                console.log("fee:", fee);
                const id_userAgent = findOrder.detail.id_boothProduct.id_user;
                console.log("id_userAgent:", id_userAgent);
                const checkBalanceAgent =
                    await balanceUserController.checkBalance(id_userAgent, fee);
                console.log("checkBalance:", checkBalanceAgent);
                const codeOrder = findOrder.codeOrder;
                const id_userBuy = findOrder.id_user;
                if (checkBalanceAgent === false) {
                    return res.status(400).json({
                        success: false,
                        message:
                            "Balance not enough. Please top up your balance to process the request.",
                    });
                }
                const updateBalance =
                    await balanceUserController.updateBalanceOrderUser(
                        id_userAgent,
                        checkBalanceAgent.usedFromW3,
                        checkBalanceAgent.usedFromBanking,
                        codeOrder
                    );
                const updateUserBuy =
                    await balanceUserController.updateBalanceW3(
                        id_userBuy,
                        codeOrder,
                        totalOrder
                    );
                await orderProductModel.findOneAndUpdate(
                    { _id: id_order },
                    { status: "Finish" },
                    { new: true }
                );

                return res.status(200).json({
                    success: true,
                    data: findOrder,
                });
            } else if (id_business === process.env.ID_BUSINESS_SERVICE) {
                const findOrder = await orderServiceModel
                    .findOne({ _id: id_order })
                    .populate({
                        path: "detail",
                        populate: {
                            path: "id_boothService",
                            populate: { path: "discountService" },
                        },
                    });
                const percentOrder =
                    findOrder.detail.id_boothService.discountService.percent;
                console.log("percent:", percentOrder);
                const totalOrder = findOrder.total;
                console.log("totalOrder:", totalOrder);
                const fee = (totalOrder * percentOrder) / 100;
                console.log("fee:", fee);
                const id_userAgent = findOrder.detail.id_boothService.id_user;
                console.log("id_userAgent:", id_userAgent);
                const checkBalanceAgent =
                    await balanceUserController.checkBalance(id_userAgent, fee);
                console.log("checkBalance:", checkBalanceAgent);
                const codeOrder = findOrder.codeOrder;
                const id_userBuy = findOrder.id_user;
                if (checkBalanceAgent === false) {
                    return res.status(400).json({
                        success: false,
                        message:
                            "Balance not enough. Please top up your balance to process the request.",
                    });
                }
                await balanceUserController.updateBalanceOrderUser(
                    id_userAgent,
                    checkBalanceAgent.usedFromW3,
                    checkBalanceAgent.usedFromBanking,
                    codeOrder
                );
                await balanceUserController.updateBalanceW3(
                    id_userBuy,
                    codeOrder,
                    totalOrder
                );
                await orderServiceModel.findOneAndUpdate(
                    { _id: id_order },
                    { status: "Finish" },
                    { new: true }
                );

                return res.status(200).json({
                    success: true,
                    data: findOrder,
                });
            }
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    },
    refundProcessing: async (id_order, id_business) => {
        if (id_business === process.env.ID_BUSINESS_PRODUCT) {
            const findOrder = await orderProductModel
                .findOne({ _id: id_order })
                .populate({
                    path: "detail",
                    populate: {
                        path: "id_boothProduct",
                        populate: { path: "discountProduct" },
                    },
                });
            const percentOrder =
                findOrder.detail.id_boothProduct.discountProduct.percent;
            console.log("percent:", percentOrder);
            const totalOrder = findOrder.total;
            console.log("totalOrder:", totalOrder);
            const fee = (totalOrder * percentOrder) / 100;
            console.log("fee:", fee);
            const id_userAgent = findOrder.detail.id_boothProduct.id_user;
            console.log("id_userAgent:", id_userAgent);
            const checkBalanceAgent = await balanceUserController.checkBalance(
                id_userAgent,
                fee
            );
            console.log("checkBalance:", checkBalanceAgent);
            const codeOrder = findOrder.codeOrder;
            const id_userBuy = findOrder.id_user;
            if (checkBalanceAgent === false) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Balance not enough. Please top up your balance to process the request.",
                });
            }
            const updateBalance =
                await balanceUserController.updateBalanceOrderUser(
                    id_userAgent,
                    checkBalanceAgent.usedFromW3,
                    checkBalanceAgent.usedFromBanking,
                    codeOrder
                );
            const updateUserBuy = await balanceUserController.updateBalanceW3(
                id_userBuy,
                codeOrder,
                totalOrder
            );
            await orderProductModel.findOneAndUpdate(
                { _id: id_order },
                { status: "Finish" },
                { new: true }
            );

            return true;
        } else if (id_business === process.env.ID_BUSINESS_SERVICE) {
            const findOrder = await orderServiceModel
                .findOne({ _id: id_order })
                .populate({
                    path: "detail",
                    populate: {
                        path: "id_boothService",
                        populate: { path: "discountService" },
                    },
                });
            const percentOrder =
                findOrder.detail.id_boothService.discountService.percent;
            console.log("percent:", percentOrder);
            const totalOrder = findOrder.total;
            console.log("totalOrder:", totalOrder);
            const fee = (totalOrder * percentOrder) / 100;
            console.log("fee:", fee);
            const id_userAgent = findOrder.detail.id_boothService.id_user;
            console.log("id_userAgent:", id_userAgent);
            const checkBalanceAgent = await balanceUserController.checkBalance(
                id_userAgent,
                fee
            );
            console.log("checkBalance:", checkBalanceAgent);
            const codeOrder = findOrder.codeOrder;
            const id_userBuy = findOrder.id_user;
            if (checkBalanceAgent === false) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Balance not enough. Please top up your balance to process the request.",
                });
            }
            await balanceUserController.updateBalanceOrderUser(
                id_userAgent,
                checkBalanceAgent.usedFromW3,
                checkBalanceAgent.usedFromBanking,
                codeOrder
            );
            await balanceUserController.updateBalanceW3(
                id_userBuy,
                codeOrder,
                totalOrder
            );
            await orderServiceModel.findOneAndUpdate(
                { _id: id_order },
                { status: "Finish" },
                { new: true }
            );

            return true;
        }
    },
    updateStatusDispute: async (req, res) => {
        try {
            const { id_order, id_business } = req.body;
            if (id_business === process.env.ID_BUSINESS_PRODUCT) {
                await orderProductModel.findOneAndUpdate(
                    { _id: id_order },
                    { status: "Dispute" },
                    { new: true }
                );
            } else if (id_business === process.env.ID_BUSINESS_SERVICE) {
                await orderServiceModel.findOneAndUpdate(
                    { _id: id_order },
                    { status: "Dispute" },
                    { new: true }
                );
            }
            return res.status(200).json({
                success: true,
                message: "Updated status dispute successfully.",
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    },
};
module.exports = litigiousController;
