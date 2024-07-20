const orderProductModel = require("../../models/orderProduct.model");
const boothProductModel = require("../../models/boothProduct.model");

const orderProductController = {
    getByIdOrderProduct: async (req, res) => {
        try {
            const _id = req.params._id;
            const find = await orderProductModel.findById(_id).populate([
                { path: "id_user" },
                {
                    path: "detail",
                    populate: [
                        { path: "id_boothProduct" },
                        { path: "id_detailBooth" },
                    ],
                },
                { path: "id_business" },
            ]);
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
    getAllOrderProduct: async (req, res) => {
        try {
            const find = await orderProductModel.find().populate([
                { path: "id_user" },
                {
                    path: "detail",
                    populate: [
                        { path: "id_boothProduct" },
                        { path: "id_detailBooth" },
                    ],
                },
                { path: "id_business" },
            ]);
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
    getOrderProductByUserAgent: async (req, res) => {
        try {
            const agentIds = req.params._id;
            const orders = await orderProductModel.find().populate([
                { path: "id_user" },
                {
                    path: "detail",
                    populate: [
                        {
                            path: "id_boothProduct",
                            populate: { path: "id_user" },
                        },
                        { path: "id_detailBooth" },
                    ],
                },
                { path: "id_business" },
                { path: "codeCoupon" },
            ]);
            const filteredOrders = orders.filter(
                (order) =>
                    order.detail &&
                    order.detail.id_boothProduct &&
                    order.detail.id_boothProduct.id_user._id.toString() ===
                        agentIds
            );
            return res.status(200).json({
                success: true,
                data: filteredOrders,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    },
    getOrderProductByUser: async (req, res) => {
        try {
            const id_user = req.params._id;
            const findOrder = await orderProductModel
                .find({ id_user: id_user })
                .populate([
                    { path: "id_user" },
                    {
                        path: "detail",
                        populate: [
                            {
                                path: "id_boothProduct",
                                populate: { path: "id_user" },
                            },
                            { path: "id_detailBooth" },
                        ],
                    },
                    { path: "id_business" },
                    { path: "codeCoupon" },
                ]);
            return res.status(200).json({
                success: true,
                data: findOrder,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    },
    updateStatusApprovedProduct: async (req, res) => {
        try {
            const updateStatus = await orderProductModel.findOneAndUpdate(
                { _id: req.params._id },
                { status: "Approved" },
                { new: true }
            );
            return res.status(200).json({
                success: true,
                data: updateStatus,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    },
    updateStatusCancelProduct: async (req, res) => {
        try {
            const updateStatus = await orderProductModel.findOneAndUpdate(
                { _id: req.params._id },
                { status: "Cancel", contentCancel: req.body.contentCancel },
                { new: true }
            );
            return res.status(200).json({
                success: true,
                data: updateStatus,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    },
    updateStatusCompletedProduct: async (req, res) => {
        try {
            console.log(123);
            const updateStatus = await orderProductModel.findOneAndUpdate(
                { _id: req.params._id },
                {
                    status: "Completed",
                    contentDelivery: req.body.contentDelivery,
                },
                { new: true }
            );
            const now = new Date();
            console.log("now:", now);
            updateStatus.completeTimeOrder = now;
            const refundTime = new Date(now);
            refundTime.setDate(refundTime.getDate() + 2);
            console.log("refundTime:", refundTime);
            updateStatus.refundTime = refundTime;
            await updateStatus.save();
            return res.status(200).json({
                success: true,
                data: updateStatus,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    },
};
module.exports = orderProductController;
