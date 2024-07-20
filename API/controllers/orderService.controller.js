const orderServiceModel = require("../../models/orderService.model");
const boothServiceModel = require("../../models/boothService.model");

const orderServiceController = {
    getByIdOrderService: async (req, res) => {
        try {
            const _id = req.params._id;
            const find = await orderServiceModel
                .findById(_id)
                .populate({ path: "id_user" })
                .populate({
                    path: "detail",
                    populate: [
                        {
                            path: "id_boothService",
                            populate: { path: "id_user" },
                        },
                        {
                            path: "id_detailBooth",
                        },
                    ],
                })
                .populate({ path: "id_business" });
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
    getAllOrderService: async (req, res) => {
        try {
            const find = await orderServiceModel
                .find()
                .populate({ path: "id_user" })
                .populate({
                    path: "detail",
                    populate: [
                        {
                            path: "id_boothService",
                            populate: { path: "id_user" },
                        },
                        {
                            path: "id_detailBooth",
                        },
                    ],
                })
                .populate({ path: "id_business" });
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
    getOrderServiceByUserAgent: async (req, res) => {
        try {
            const sellerIds = req.params._id;
            const orders = await orderServiceModel.find().populate([
                { path: "id_user" },
                {
                    path: "detail",
                    populate: [
                        {
                            path: "id_boothService",
                            //match: { id_user: { $in: sellerIds } },
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
                    order.detail.id_boothService &&
                    order.detail.id_boothService.id_user._id.toString() ===
                        sellerIds
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
    getOrderServiceByUser: async (req, res) => {
        try {
            const id_user = req.params._id;
            const findOrder = await orderServiceModel
                .find({ id_user: id_user })
                .populate([
                    { path: "id_user" },
                    {
                        path: "detail",
                        populate: [
                            {
                                path: "id_boothService",
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
    updateStatusApprovedService: async (req, res) => {
        try {
            const findOrderService = await orderServiceModel.findById(
                req.params._id
            );
            const timeApproved = new Date();
            console.log("timeApproved:", timeApproved);
            const timeRequiredComplete = new Date(timeApproved);
            timeRequiredComplete.setDate(
                timeRequiredComplete.getDate() + findOrderService.finishDay
            );
            // const timeRequiredComplete = timeApproved.setDate(
            //     timeApproved.getDate() + findOrderService.finishDay
            // );
            console.log("timeRequiredComplete:", timeRequiredComplete);
            const updateStatus = await orderServiceModel.findOneAndUpdate(
                { _id: req.params._id },
                {
                    status: "Approved",
                    timeApproved: timeApproved,
                    timeRequiredComplete: timeRequiredComplete,
                },
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
    updateStatusCancelService: async (req, res) => {
        try {
            const updateStatus = await orderServiceModel.findOneAndUpdate(
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
    updateStatusCompletedService: async (req, res) => {
        try {
            const dateComplete = new Date();
            const findOrderService = await orderServiceModel.findById(
                req.params._id
            );
            if (dateComplete > findOrderService.timeRequiredComplete) {
                findOrderService.status = "Outofdate";
                await findOrderService.save();
                return res.status(400).json({
                    success: false,
                    message:
                        "Order completion time exceeds the required completion time!",
                });
            }
            const updateStatus = await orderServiceModel.findOneAndUpdate(
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
module.exports = orderServiceController;
