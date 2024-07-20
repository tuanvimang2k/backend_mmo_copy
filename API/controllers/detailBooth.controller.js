const boothProductModel = require("../../models/boothProduct.model");
const boothServiceModel = require("../../models/boothService.model");
const detailBoothProductModel = require("../../models/detailBoothProduct.model");
const detailBoothServiceModel = require("../../models/detailBoothService.model");

const detailBoothController = {
    saveDetailBooth: async (req, res) => {
        try {
            const id_business = req.body.id_business;
            const id_booth = req.body.id_booth;
            if (id_business === process.env.ID_BUSINESS_PRODUCT) {
                const { name, price, quantity } = req.body;
                const find_id_booth = await boothProductModel.findOne({
                    _id: id_booth,
                });
                if (!find_id_booth) {
                    return res.status(400).json({
                        success: false,
                        message: `Invalid booth with ID ${id_booth}`,
                    });
                }
                const newDetailBoothProduct = new detailBoothProductModel({
                    name: name,
                    price: price,
                    quantity: quantity,
                });
                const saveNewDetailBoothProduct =
                    await newDetailBoothProduct.save();
                const saveDetailBooth = saveNewDetailBoothProduct._id;
                find_id_booth.detailBooth.push(saveDetailBooth);
                await find_id_booth.save();
            } else if (id_business === process.env.ID_BUSINESS_SERVICE) {
                const { name, price } = req.body;
                const find_id_booth = await boothServiceModel.findOne({
                    _id: id_booth,
                });
                if (!find_id_booth) {
                    return res.status(400).json({
                        success: false,
                        message: `Invalid booth with ID ${id_booth}`,
                    });
                }
                const newDetailBoothService = new detailBoothServiceModel({
                    name: name,
                    price: price,
                });
                const saveNewDetailBoothService =
                    await newDetailBoothService.save();
                const saveDetailBoothService = saveNewDetailBoothService._id;
                find_id_booth.detailBooth.push(saveDetailBoothService);
                await find_id_booth.save();
            } else {
                return res.status(400).json({
                    success: false,
                    message: "Invalid id_business value",
                });
            }
            return res.status(200).json({
                success: true,
                message: "Detail booth service added successfully",
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    },
    updateDetailBooth: async (req, res) => {
        try {
            const id_businessType = req.body.id_businessType;
            const id_detailBooth = req.body.id_detailBooth;
            if (id_businessType === process.env.ID_BUSINESS_PRODUCT) {
                const { name, price, status } = req.body;
                const updateDetailBooth =
                    await detailBoothProductModel.findOneAndUpdate(
                        { _id: id_detailBooth },
                        {
                            name: name,
                            price: price,
                            status: status,
                        },
                        { new: true }
                    );
                if (!updateDetailBooth) {
                    return res.status(400).json({
                        success: false,
                        message: "Invalid detail booth product!",
                    });
                }
            } else if (id_businessType === process.env.ID_BUSINESS_SERVICE) {
                const { name, price, status } = req.body;
                const updateDetailBooth =
                    await detailBoothServiceModel.findOneAndUpdate(
                        {
                            _id: id_detailBooth,
                        },
                        {
                            name: name,
                            price: price,
                            status: status,
                        },
                        { new: true }
                    );
                if (!updateDetailBooth) {
                    return res.status(400).json({
                        success: false,
                        message: "Invalid detail booth product!",
                    });
                }
            }
            return res.status(200).json({
                success: true,
                message: "Updated detail booth successfully.",
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    },
    getDetailBoothByBooth: async (req, res) => {
        try {
            const id_businessType = req.query.id_businessType;
            const id_detailBooth = req.query.id_detailBooth;
            if (id_businessType === process.env.ID_BUSINESS_PRODUCT) {
                const find = await detailBoothProductModel.findOne({
                    _id: id_detailBooth,
                });
                return res.status(200).json({
                    success: true,
                    data: find,
                });
            } else if (id_businessType === process.env.ID_BUSINESS_SERVICE) {
                const find = await detailBoothServiceModel.findOne({
                    _id: id_detailBooth,
                });
                return res.status(200).json({
                    success: true,
                    data: find,
                });
            } else {
                return res.status(400).json({
                    success: false,
                    message: "Invalid id_businessType value",
                });
            }
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    },
    getDetailBoothByIdDetailBooth: async (req, res) => {
        try {
            const id_business = req.query.id_business;
            const id_detailBooth = req.query.id_detailBooth;
            let find;
            if (id_business === process.env.ID_BUSINESS_PRODUCT) {
                find = await detailBoothProductModel.findOne({
                    _id: id_detailBooth,
                });
                console.log(find);
            } else if (id_business === process.env.ID_BUSINESS_SERVICE) {
                find = await detailBoothServiceModel.findOne({
                    _id: id_detailBooth,
                });
            }
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
    deleteDetailBooth: async (req, res) => {
        try {
            const { id_business, id_detailBooth, id_booth } = req.body;
            if (process.env.ID_BUSINESS_PRODUCT === id_business) {
                await detailBoothProductModel.findByIdAndDelete(id_detailBooth);
                await boothProductModel.updateOne(
                    { _id: id_booth },
                    { $pull: { detailBooth: id_detailBooth } }
                );
            } else if (process.env.ID_BUSINESS_SERVICE === id_business) {
                await detailBoothServiceModel.findByIdAndDelete(id_detailBooth);
                await boothServiceModel.updateOne(
                    { _id: id_booth },
                    { $pull: { detailBooth: id_detailBooth } }
                );
            }
            return res.status(200).json({
                success: true,
                message: "Delete detail booth successfully.",
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    },
};
module.exports = detailBoothController;
