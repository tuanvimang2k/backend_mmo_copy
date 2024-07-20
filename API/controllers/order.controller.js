const moment = require("moment");
const orderProductModel = require("../../models/orderProduct.model");
const orderServiceModel = require("../../models/orderService.model");
const detailOrderProductModel = require("../../models/detailOrderProduct.model");
const detailOrderServiceModel = require("../../models/detailOrderService.model");
const couponModel = require("../../models/coupon.model");
const detailBoothProduct = require("../../models/detailBoothProduct.model");
const detailBoothService = require("../../models/detailBoothService.model");
const balanceUserController = require("../controllers/balanceUser.controller");
const userModel = require("../../models/user.model");
const balanceModel = require("../../models/balanceUser.model");
const hrefController = require("./linkRef.controller");
const siteController = require("./siteUser.controller");
const depositCommissionConfigController = require("../controllers/depositCommissionConfig.controller");
const discountModel = require("../../models/discount.model");
const boothProductModel = require("../../models/boothProduct.model");
const boothServiceModel = require("../../models/boothService.model");
const resellerModel = require("../../models/reseller.model");
const resellerController = require("./reseller.controller");
const transactionHistoryController = require("./transactionHistory.controller");

function generateCodeOrder(length = 10) {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let promoCode = "";
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        promoCode += characters[randomIndex];
    }
    return promoCode;
}
const orderController = {
    createOrder: async (req, res) => {
        try {
            const {
                id_user,
                id_business,
                id_booth,
                id_detailBooth,
                quantity,
                total,
                id_seller,
            } = req.body;

            const codeCoupon = req.body.codeCoupon || "";
            const linkReseller = req.body.linkReseller || "";
            const requestContent = req.body.requestContent || "";

            //check balance user
            const checkBalance = await balanceUserController.checkBalance(
                id_user,
                total
            );
            console.log("checkBalance:", checkBalance);
            // console.log(checkBalance.usedFromBanking);

            // return res.status(200).json({
            // success: false,
            // });
            if (checkBalance === false) {
                return res.status(400).json({
                    success: false,
                    message: "Balance not enough!",
                });
            }
            const codeOrder = generateCodeOrder();
            if (codeCoupon) {
                if (id_business === process.env.ID_BUSINESS_PRODUCT) {
                    // const quantity = req.body.quantity;
                    const findCoupon = await couponModel.findOne({
                        code: codeCoupon,
                        id_boothProduct: id_booth,
                    });
                    console.log("findCoupon:", findCoupon);
                    if (!findCoupon) {
                        return res.status(400).json({
                            success: false,
                            message: "The coupon not found!",
                        });
                    }
                    //check coupon
                    const checkTimeCoupon = moment().isBetween(
                        moment(findCoupon.startDate).tz("Asia/Bangkok"),
                        moment(findCoupon.endDate).tz("Asia/Bangkok")
                    );
                    console.log("checkTime:", checkTimeCoupon);
                    if (
                        checkTimeCoupon === false ||
                        findCoupon.soldQuantity + 1 > findCoupon.numberPromo
                    ) {
                        return res.status(400).json({
                            success: false,
                            message: "The coupon code has expired!",
                        });
                    }
                    const findDetail = await detailBoothProduct.findOne({
                        _id: id_detailBooth,
                    });
                    console.log(
                        "findDetail:",
                        findDetail.countQuantity + quantity
                    );
                    if (
                        findDetail.countQuantity + Number(quantity) >
                        findDetail.quantity
                    ) {
                        return res.status(400).json({
                            success: false,
                            message: "The product not enough quantity!",
                        });
                    }
                    //refund
                    const findDiscount = await boothProductModel
                        .findOne({ _id: id_booth })
                        .populate({ path: "discountProduct" });
                    //
                    const total =
                        findDetail.price * quantity -
                        (findDetail.price * quantity * findCoupon.percent) /
                        100;
                    const discount =
                        total * [findDiscount.discountProduct.percent / 100];
                    console.log("discount:", discount);
                    const totalRefund = total - discount;
                    //
                    const newDetailOrderProduct = new detailOrderProductModel({
                        id_boothProduct: id_booth,
                        id_detailBooth: id_detailBooth,
                        quantity: quantity,
                        requestContent: requestContent,
                    });
                    const saveDetail = await newDetailOrderProduct.save();
                    const newOrderProduct = new orderProductModel({
                        id_user: id_user,
                        codeCoupon: findCoupon._id,
                        detail: saveDetail._id,
                        // total: findDetail.price * quantity,
                        total: total,
                        id_business: id_business,
                        codeOrder: codeOrder,
                        contentCancel: null,
                        contentDelivery: null,
                        id_seller: id_seller,
                        totalRefund: totalRefund,
                    });
                    const saveNewOrderProduct = await newOrderProduct.save();
                    //orderReseller
                    if (linkReseller !== "") {
                        console.log("....................");
                        const orderReseller =
                            await resellerController.orderReseller(
                                linkReseller,
                                saveNewOrderProduct._id,
                                id_business,
                                totalRefund,
                                id_booth
                            );
                        console.log("orderReseller:", orderReseller);
                        if (orderReseller === false) {
                            await detailOrderProductModel.findByIdAndDelete(
                                saveNewOrderProduct.detail
                            );
                            await orderProductModel.findByIdAndDelete(
                                saveNewOrderProduct._id
                            );
                            return res.status(400).json({
                                success: false,
                                message: "Link reseller not found!",
                            });
                        }
                    }
                    //
                    await detailBoothProduct.findOneAndUpdate(
                        { _id: id_detailBooth },
                        { $inc: { countQuantity: quantity } },
                        { new: true }
                    );
                    //update balance user
                    const updateUser =
                        await balanceUserController.updateBalanceOrderUser(
                            id_user,
                            checkBalance.usedFromW3,
                            checkBalance.usedFromBanking,
                            codeOrder
                        );
                    //update balance admin
                    const findAdmin = await userModel.findOne({
                        role: "admin",
                    });
                    await balanceModel.findOneAndUpdate(
                        { id_user: findAdmin._id },
                        { $inc: { balance: saveNewOrderProduct.total } },
                        { new: true }
                    );
                    //updateHistory
                    const reason = `Deposit from order ${codeOrder}`;
                    await transactionHistoryController.saveTransactionRecharge(
                        saveNewOrderProduct.total,
                        findAdmin._id,
                        reason
                    );
                    //reward transaction w3
                    const update =
                        await depositCommissionConfigController.rewardDepositTransactionW3(
                            id_seller,
                            checkBalance.usedFromW3
                        );
                    if (update === true) {
                        return res.status(400).json({
                            success: false,
                            message: "The id_seller booth not found!",
                        });
                    }
                    //update soldQuantity
                    const coupon = await couponModel.findOneAndUpdate(
                        { code: codeCoupon },
                        { $inc: { soldQuantity: 1 } },
                        { new: true }
                    );
                    //refSystem
                    const findUser = await userModel.findOne({ _id: id_user });
                    console.log("findUser:", findUser);
                    const updateRefSystem = await hrefController.reward(
                        findUser.gmail
                    );
                    console.log("updateRefSystem:", updateRefSystem);
                    if (updateRefSystem.length !== 0) {
                        const update = await siteController.updateTotalReward(
                            updateRefSystem,
                            saveNewOrderProduct.total
                        );
                    }
                    //
                    return res.status(200).json({
                        success: false,
                        data: saveNewOrderProduct,
                    });
                }
                if (id_business === process.env.ID_BUSINESS_SERVICE) {
                    const findCoupon = await couponModel.findOne({
                        code: codeCoupon,
                        id_boothService: id_booth,
                    });
                    if (!findCoupon) {
                        return res.status(400).json({
                            success: false,
                            message: "The coupon not found!",
                        });
                    }
                    const checkTimeCoupon = moment().isBetween(
                        moment(findCoupon.startDate).tz("Asia/Bangkok"),
                        moment(findCoupon.endDate).tz("Asia/Bangkok")
                    );
                    if (
                        checkTimeCoupon === false ||
                        findCoupon.soldQuantity + 1 > findCoupon.numberPromo
                    ) {
                        return res.status(400).json({
                            success: false,
                            message: "The coupon code has expired!",
                        });
                    }
                    const finishDay = req.body.finishDay;
                    const findDetail = await detailBoothService.findOne({
                        _id: id_detailBooth,
                    });
                    if (findDetail.quantity < quantity) {
                        return res.status(400).json({
                            success: false,
                            message: "The product not enough quantity!",
                        });
                    }
                    //
                    const findDiscount = await boothServiceModel
                        .findOne({ _id: id_booth })
                        .populate({ path: "discountService" });
                    // const totalRefund =
                    //     findDetail.price * quantity -
                    //     (findDetail.price *
                    //         quantity *
                    //         findDiscount.discountService.percent) /
                    //         100;
                    const total =
                        findDetail.price * quantity -
                        (findDetail.price * quantity * findCoupon.percent) /
                        100;
                    const discount =
                        total * [findDiscount.discountService.percent / 100];
                    console.log("discount:", discount);
                    const totalRefund = total - discount;
                    //
                    const newDetailOrderProduct = new detailOrderServiceModel({
                        id_boothProduct: id_booth,
                        id_detailBooth: id_detailBooth,
                        quantity: quantity,
                        requestContent: requestContent,
                    });
                    const saveDetail = await newDetailOrderProduct.save();
                    const newOrderProduct = new orderServiceModel({
                        id_user: id_user,
                        codeCoupon: findCoupon._id,
                        detail: saveDetail._id,
                        total: total,
                        id_business: id_business,
                        finishDay: finishDay,
                        codeOrder: codeOrder,
                        contentCancel: null,
                        contentDelivery: null,
                        id_seller: id_seller,
                        totalRefund: totalRefund,
                    });
                    const saveNewOrderProduct = await newOrderProduct.save();
                    //orderReseller
                    if (linkReseller !== "") {
                        console.log("....................");
                        const orderReseller =
                            await resellerController.orderReseller(
                                linkReseller,
                                saveNewOrderProduct._id,
                                id_business,
                                totalRefund,
                                id_booth
                            );
                        console.log("orderReseller:", orderReseller);
                        if (orderReseller === false) {
                            await detailOrderProductModel.findByIdAndDelete(
                                saveNewOrderProduct.detail
                            );
                            await orderProductModel.findByIdAndDelete(
                                saveNewOrderProduct._id
                            );
                            return res.status(400).json({
                                success: false,
                                message: "Link reseller not found!",
                            });
                        }
                    }
                    //updateCoupon
                    const coupon = await couponModel.findOneAndUpdate(
                        { code: codeCoupon },
                        { $inc: { soldQuantity: 1 } },
                        { new: true }
                    );
                    //
                    const findAdmin = await userModel.findOne({
                        role: "admin",
                    });
                    //update balance user
                    const updateUser =
                        await balanceUserController.updateBalanceOrderUser(
                            id_user,
                            checkBalance.usedFromW3,
                            checkBalance.usedFromBanking,
                            codeOrder
                        );
                    //update balance admin
                    await balanceModel.findOneAndUpdate(
                        { id_user: findAdmin._id },
                        { $inc: { balance: saveNewOrderProduct.total } },
                        { new: true }
                    );
                    //updateHistory
                    const reason = `Deposit from order ${codeOrder}`;
                    await transactionHistoryController.saveTransactionRecharge(
                        saveNewOrderProduct.total,
                        findAdmin._id,
                        reason
                    );
                    //reward transaction w3
                    const update =
                        await depositCommissionConfigController.rewardDepositTransactionW3(
                            id_seller,
                            checkBalance.usedFromW3
                        );
                    if (update === true) {
                        return res.status(400).json({
                            success: false,
                            message: "The id_seller booth not found!",
                        });
                    }
                    //refSystem
                    const findUser = await userModel.findOne({ _id: id_user });
                    console.log("findUser:", findUser);
                    const updateRefSystem = await hrefController.reward(
                        findUser.gmail
                    );
                    console.log("updateRefSystem:", updateRefSystem);
                    if (updateRefSystem.length !== 0) {
                        const update = await siteController.updateTotalReward(
                            updateRefSystem,
                            saveNewOrderProduct.total
                        );
                    }
                    /////////////
                    return res.status(200).json({
                        success: false,
                        data: saveNewOrderProduct,
                    });
                }
            }
            if (codeCoupon.trim() === "") {
                console.log("=============================");
                if (id_business === process.env.ID_BUSINESS_PRODUCT) {
                    const findDetail = await detailBoothProduct.findOne({
                        _id: id_detailBooth,
                    });
                    console.log(findDetail.countQuantity);
                    console.log(findDetail.countQuantity + quantity);
                    console.log(findDetail.quantity);
                    if (
                        Number(findDetail.countQuantity) + Number(quantity) >
                        findDetail.quantity
                    ) {
                        return res.status(400).json({
                            success: false,
                            message: "The product not enough quantity!",
                        });
                    }
                    //
                    const findDiscount = await boothProductModel
                        .findOne({ _id: id_booth })
                        .populate({ path: "discountProduct" });
                    // const total = (findDetail.price * quantity) - (findDetail.price * quantity*findDiscount.discountProduct.)
                    const totalRefund =
                        findDetail.price * quantity -
                        (findDetail.price *
                            quantity *
                            findDiscount.discountProduct.percent) /
                        100;
                    console.log("totalRefund:", totalRefund);
                    //
                    const newDetailOrderProduct = new detailOrderProductModel({
                        id_boothProduct: id_booth,
                        id_detailBooth: id_detailBooth,
                        quantity: quantity,
                        requestContent: requestContent,
                    });
                    const saveDetail = await newDetailOrderProduct.save();
                    const newOrderProduct = new orderProductModel({
                        id_user: id_user,
                        codeCoupon: null,
                        detail: saveDetail._id,
                        total: findDetail.price * quantity,
                        id_business: id_business,
                        codeOrder: codeOrder,
                        contentCancel: null,
                        contentDelivery: null,
                        id_seller: id_seller,
                        totalRefund: totalRefund,
                    });
                    const saveNewOrderProduct = await newOrderProduct.save();
                    console.log("saveNewOrderProduct:", saveNewOrderProduct);
                    //orderReseller
                    if (linkReseller !== "") {
                        console.log("....................");
                        const orderReseller =
                            await resellerController.orderReseller(
                                linkReseller,
                                saveNewOrderProduct._id,
                                id_business,
                                totalRefund,
                                id_booth
                            );
                        console.log("orderReseller:", orderReseller);
                        if (orderReseller === false) {
                            await detailOrderProductModel.findByIdAndDelete(
                                saveNewOrderProduct.detail
                            );
                            await orderProductModel.findByIdAndDelete(
                                saveNewOrderProduct._id
                            );
                            return res.status(400).json({
                                success: false,
                                message: "Link reseller not found!",
                            });
                        }
                    }
                    //update balance user
                    const updateUser =
                        await balanceUserController.updateBalanceOrderUser(
                            id_user,
                            checkBalance.usedFromW3,
                            checkBalance.usedFromBanking,
                            codeOrder
                        );
                    //
                    await detailBoothProduct.findOneAndUpdate(
                        { _id: id_detailBooth },
                        { $inc: { countQuantity: quantity } },
                        { new: true }
                    );
                    //
                    const findAdmin = await userModel.findOne({
                        role: "admin",
                    });
                    await balanceModel.findOneAndUpdate(
                        { id_user: findAdmin._id },
                        { $inc: { balance: saveNewOrderProduct.total } },
                        { new: true }
                    );
                    //updateHistory
                    const reason = `Deposit from order ${codeOrder}`;
                    await transactionHistoryController.saveTransactionRecharge(
                        saveNewOrderProduct.total,
                        findAdmin._id,
                        reason
                    );
                    //reward transaction w3
                    const update =
                        await depositCommissionConfigController.rewardDepositTransactionW3(
                            id_seller,
                            checkBalance.usedFromW3
                        );
                    if (update === true) {
                        return res.status(400).json({
                            success: false,
                            message: "The id_seller booth not found!",
                        });
                    }
                    //refSystem
                    const findUser = await userModel.findOne({ _id: id_user });
                    // console.log("findUser:", findUser);
                    const updateRefSystem = await hrefController.reward(
                        findUser.gmail
                    );
                    // console.log("updateRefSystem:", updateRefSystem);
                    if (updateRefSystem.length !== 0) {
                        const update = await siteController.updateTotalReward(
                            updateRefSystem,
                            saveNewOrderProduct.total
                        );
                    }
                    //////////////////////////////
                    return res.status(200).json({
                        success: false,
                        data: saveNewOrderProduct,
                    });
                }
                if (id_business === process.env.ID_BUSINESS_SERVICE) {
                    console.log("+++++++++++++++++++++++++++++++");
                    const finishDay = req.body.finishDay;
                    const findDetail = await detailBoothService.findOne({
                        _id: id_detailBooth,
                    });
                    console.log("findDetail:", findDetail);
                    //
                    const findDiscount = await boothServiceModel
                        .findOne({ _id: id_booth })
                        .populate({ path: "discountService" });
                    console.log("findDiscount:", findDiscount);
                    const totalRefund =
                        findDetail.price * quantity -
                        (findDetail.price *
                            quantity *
                            findDiscount.discountService.percent) /
                        100;
                    //
                    const newDetailOrderProduct = new detailOrderServiceModel({
                        id_boothService: id_booth,
                        id_detailBooth: id_detailBooth,
                        quantity: quantity,
                        requestContent: requestContent,
                    });
                    const saveDetail = await newDetailOrderProduct.save();
                    console.log(codeCoupon);
                    const newOrderProduct = new orderServiceModel({
                        id_user: id_user,
                        codeCoupon: null,
                        detail: saveDetail._id,
                        total: findDetail.price * quantity,
                        id_business: id_business,
                        finishDay: finishDay,
                        id_business: id_business,
                        codeOrder: codeOrder,
                        contentCancel: null,
                        contentDelivery: null,
                        id_seller: id_seller,
                        totalRefund: totalRefund,
                    });
                    const saveNewOrderProduct = await newOrderProduct.save();
                    //orderReseller
                    if (linkReseller !== "") {
                        console.log("....................");
                        const orderReseller =
                            await resellerController.orderReseller(
                                linkReseller,
                                saveNewOrderProduct._id,
                                id_business,
                                totalRefund,
                                id_booth
                            );
                        console.log("orderReseller:", orderReseller);
                        if (orderReseller === false) {
                            await detailOrderServiceModel.findByIdAndDelete(
                                saveNewOrderProduct.detail
                            );
                            await orderServiceModel.findByIdAndDelete(
                                saveNewOrderProduct._id
                            );
                            return res.status(400).json({
                                success: false,
                                message: "Link reseller not found!",
                            });
                        }
                    }
                    const findAdmin = await userModel.findOne({
                        role: "admin",
                    });
                    //update balance user
                    const updateUser =
                        await balanceUserController.updateBalanceOrderUser(
                            id_user,
                            checkBalance.usedFromW3,
                            checkBalance.usedFromBanking,
                            codeOrder
                        );
                    //update balance admin
                    await balanceModel.findOneAndUpdate(
                        { id_user: findAdmin._id },
                        { $inc: { balance: saveNewOrderProduct.total } },
                        { new: true }
                    );
                    //updateHistory
                    const reason = `Deposit from order ${codeOrder}`;
                    await transactionHistoryController.saveTransactionRecharge(
                        saveNewOrderProduct.total,
                        findAdmin._id,
                        reason
                    );
                    //reward transaction w3
                    const update =
                        await depositCommissionConfigController.rewardDepositTransactionW3(
                            id_seller,
                            checkBalance.usedFromW3
                        );
                    if (update === true) {
                        return res.status(400).json({
                            success: false,
                            message: "The id_seller booth not found!",
                        });
                    }
                    //ref
                    const findUser = await userModel.findOne({ _id: id_user });
                    console.log("findUser:", findUser);
                    const updateRefSystem = await hrefController.reward(
                        findUser.gmail
                    );
                    console.log("updateRefSystem:", updateRefSystem);
                    if (updateRefSystem.length !== 0) {
                        const update = await siteController.updateTotalReward(
                            updateRefSystem,
                            saveNewOrderProduct.total
                        );
                    }
                    return res.status(200).json({
                        success: false,
                        data: saveNewOrderProduct,
                    });
                }
            }
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    },
};
module.exports = orderController;
