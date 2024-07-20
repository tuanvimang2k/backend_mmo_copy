const resellerModel = require("../../models/reseller.model");
const orderProductModel = require("../../models/orderProduct.model");
const orderServiceModel = require("../../models/orderService.model");

const resellerController = {
    createReseller: async (id_booth, id_reseller) => {
        const booth = process.env.BOOTH_RESELLER + id_booth;
        const reseller = process.env.RESELLER_RESELLER + id_reseller;
        return {
            link: `https://${process.env.domain}/reseller?booth=${booth}&reseller=${reseller}`,
        };
    },
    saveReseller: async (req, res) => {
        try {
            const {
                id_user_reseller,
                percent,
                message,
                id_booth,
                id_user_agent,
                id_business,
            } = req.body;
            let newReseller;
            if (id_business === process.env.ID_BUSINESS_PRODUCT) {
                newReseller = await new resellerModel({
                    id_user_agent: id_user_agent,
                    id_user_reseller: id_user_reseller,
                    id_boothProduct: id_booth,
                    id_boothService: null,
                    percent: percent,
                    message: message,
                }).save();
            } else if (id_business === process.env.ID_BUSINESS_SERVICE) {
                newReseller = await new resellerModel({
                    id_user_agent: id_user_agent,
                    id_user_reseller: id_user_reseller,
                    id_boothService: id_booth,
                    id_boothProduct: null,
                    percent: percent,
                    message: message,
                }).save();
            }
            return res.status(200).json({
                success: true,
                data: newReseller,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    },
    getResellerByIdUserAgent: async (req, res) => {
        try {
            const id_user_agent = req.params._id;
            const findReseller = await resellerModel
                .find({ id_user_agent: id_user_agent })
                .populate([
                    { path: "id_user_reseller" },
                    { path: "id_boothProduct" },
                    { path: "id_boothService" },
                ]);
            return res.status(200).json({
                success: true,
                data: findReseller,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    },
    updateStatusResellerApproved: async (req, res) => {
        try {
            const _id = req.params._id;
            const id_booth = req.body.id_booth;
            const linkReseller = await resellerController.createReseller(
                id_booth,
                _id
            );
            //status: approved
            const updateStatusReseller = await resellerModel.findOneAndUpdate(
                { _id: _id },
                {
                    statusReseller: "approved",
                    linkReseller: linkReseller.link,
                },
                { new: true }
            );

            return res.status(200).json({
                success: true,
                message: "Updated status reseller successfully.",
                data: updateStatusReseller,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    },
    updateStatusResellerCancel: async (req, res) => {
        try {
            const _id = req.params._id;
            //status: cancel
            const updateStatusReseller = await resellerModel.findOneAndUpdate(
                { _id: _id },
                {
                    statusReseller: "cancel",
                },
                { new: true }
            );

            return res.status(200).json({
                success: true,
                message: "Updated status reseller successfully.",
                data: updateStatusReseller,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    },
    getResellerByUserAgentStatus: async (req, res) => {
        try {
            //Pending, Approved, Cancel
            const id_user_agent = req.query.id_user_agent;
            const status_reseller = req.query.status_reseller;
            const find = await resellerModel.find({
                id_user_agent: id_user_agent,
                statusReseller: status_reseller,
            });
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
    // test: async (req, res) => {
    //     try {
    //         const link =
    //             "https://mmoweb3.com/reseller/booth=b7f9664424be0d7f6668fa125422&reseller=4d17664ebb621b56bd382647fb4a";
    //         const test = await resellerController.orderReseller(link);
    //         return true;
    //     } catch (error) {
    //         return res.status(500).json({
    //             success: false,
    //             message: error.message,
    //         });
    //     }
    // },
    orderReseller: async (
        linkReseller,
        id_order,
        id_business,
        totalRefund,
        id_booth
    ) => {
        const splitBooth = linkReseller.split("booth=");
        const split = splitBooth[1].split("&reseller=");
        const idBooth = split[0].slice(4).trim();
        if (idBooth !== id_booth) {
            return false;
        }
        const id_reseller = split[1].slice(4).trim();
        // const findOrderReseller = await resellerModel.findOne({
        //     _id: id_reseller,
        //     id_boothProduct: id_booth,
        // });
        // findOrderReseller.id_order.push(id_order);
        // const saveResellerOrder = await findOrderReseller.save();
        if (process.env.ID_BUSINESS_PRODUCT === id_business) {
            const findReseller = await resellerModel.findOne({
                _id: id_reseller,
                id_boothProduct: id_booth,
            });
            let totalRefundFinal =
                totalRefund - (totalRefund * findReseller.percent) / 100;
            console.log("totalRefundFinal:", totalRefundFinal);
            const refundReseller = (totalRefund * findReseller.percent) / 100;
            console.log("refundReseller:", refundReseller);
            const find = await resellerModel.findOneAndUpdate(
                { _id: id_reseller, id_boothProduct: id_booth },
                { $push: { id_orderProduct: id_order } },
                { new: true }
            );

            await orderProductModel.findOneAndUpdate(
                { _id: id_order },
                {
                    $set: {
                        id_reseller: id_reseller,
                        refundReseller: refundReseller,
                        totalRefund: totalRefundFinal,
                        isRefundReseller: false,
                    },
                },
                { new: true }
            );
        } else if (process.env.ID_BUSINESS_SERVICE === id_business) {
            const findReseller = await resellerModel.findOne({
                _id: id_reseller,
                id_boothService: id_booth,
            });
            let totalRefundFinal =
                totalRefund - (totalRefund * findReseller.percent) / 100;
            const refundReseller = (totalRefund * findReseller.percent) / 100;
            await resellerModel.findOneAndUpdate(
                { _id: id_reseller, id_boothService: id_booth },
                { $push: { id_orderService: id_order } },
                { new: true }
            );
            await orderServiceModel.findOneAndUpdate(
                { _id: id_order },
                {
                    $set: {
                        id_seller: id_reseller,
                        refundReseller: refundReseller,
                        totalRefund: totalRefundFinal,
                        isRefundReseller: false,
                    },
                },
                { new: true }
            );
        }
        return true;
    },
    getOrderReseller: async (req, res) => {
        try {
            // const findReseller = await resellerModel.findOne({
            //     id_user_reseller: req.params._id,
            // }).populate[
            //     ({ path: "id_boothProduct" }, { path: "id_boothService" })
            // { path: "id_orderProduct" }, { path: "id_orderService" }
            // { path: "id_boothProduct" },
            // { path: "id_boothService" }
            // ];
            const findReseller = await resellerModel
                .find({
                    id_user_reseller: req.params._id,
                })
                .populate("id_boothProduct")
                .populate("id_boothService")
                .populate("id_orderProduct")
                .populate("id_orderService");
            return res.status(200).json({
                success: true,
                data: findReseller,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    },
    getIdReseller: async (req, res) => {
        try {
            const find = await resellerModel
                .find({
                    id_user_reseller: req.params._id,
                })
                .populate({ path: "id_boothProduct" })
                .populate({ path: "id_boothService" });
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
    getIdResellerBooth: async (req, res) => {
        try {
            const { id_reseller, id_booth } = req.query;
            const query = {
                _id: id_reseller,
                $or: [
                    {
                        id_boothProduct: id_booth,
                    },
                    { id_boothService: id_booth },
                ],
            };
            const result = await resellerModel
                .find(query)
                .populate({
                    path: "id_boothProduct",
                    populate: [
                        { path: "detailBooth" },
                        { path: "id_businessType" },
                        { path: "id_boothType" },
                        { path: "id_user" },
                    ],
                })
                .populate({
                    path: "id_boothService",
                    populate: [
                        { path: "detailBooth" },
                        { path: "id_businessType" },
                        { path: "id_boothType" },
                        { path: "id_user" },
                    ],
                });
            return res.status(200).json({
                success: true,
                data: result,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    },
};

module.exports = resellerController;
