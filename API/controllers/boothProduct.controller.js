const boothProductModel = require("../../models/boothProduct.model");

const boothProductController = {
    //Lấy tất cả gian hàng sản phẩm (Admin)
    getAllBoothProduct: async (req, res) => {
        try {
            const findAllBoothProduct = await boothProductModel
                .find()
                .populate([
                    { path: "id_businessType" },
                    { path: "id_boothType" },
                    { path: "id_user" },
                    { path: "detailBooth" },
                ]);
            return res.status(200).json({
                success: true,
                data: findAllBoothProduct,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    },
    updateStatusApproved: async (req, res) => {
        try {
            const update = await boothProductModel.findOneAndUpdate(
                { _id: req.params._id },
                { statusBooth: "Approved" },
                { new: true }
            );
            return res.status(200).json({
                success: true,
                data: update,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    },
    updateStatusCancel: async (req, res) => {
        try {
            const update = await boothProductModel.findOneAndUpdate(
                { _id: req.params._id },
                { statusBooth: "Cancel" },
                { new: true }
            );
            return res.status(200).json({
                success: true,
                data: update,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    },
    paginationIdBoothType: async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const id_boothType = req.query.id_boothType;

            const skip = (page - 1) * limit;
            const query = { id_boothType: id_boothType };
            const findAllProduct = await boothProductModel
                .find({ id_boothType: id_boothType })
                .populate([
                    { path: "id_businessType" },
                    { path: "id_boothType" },
                    { path: "id_user" },
                    { path: "detailBooth" },
                ])
                .skip(skip)
                .limit(limit);
            const total = await boothProductModel.countDocuments(query);
            return res.status(200).json({
                success: true,
                data: findAllProduct,
                pagination: {
                    totalItems: total,
                    currentPage: page,
                    totalPages: Math.ceil(total / limit),
                    pageSize: limit,
                },
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    },
};
module.exports = boothProductController;
