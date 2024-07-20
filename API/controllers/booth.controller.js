const boothProductModel = require("../../models/boothProduct.model");
const boothServiceModel = require("../../models/boothService.model");
const businessTypeModel = require("../../models/businessType.model");
const boothTypeModel = require("../../models/boothType.model");
const detailBoothProductModel = require("../../models/detailBoothProduct.model");
const detailBoothServiceModel = require("../../models/detailBoothService.model");

const boothController = {
    createBooth: async (req, res) => {
        try {
            // Gởi lên statusReseller: tít -> true, không -> false
            const {
                id_business,
                id_booth_type,
                nameBooth,
                desc,
                shortDesc,
                statusReseller,
                discount,
                id_user,
            } = req.body;
            const id_business_product = process.env.ID_BUSINESS_PRODUCT;
            //console.log("id_business_product:", id_business_product);
            const id_business_service = process.env.ID_BUSINESS_SERVICE;
            const findIdBusinessType = await businessTypeModel.findOne({
                _id: id_business,
            });
            if (!findIdBusinessType) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid business type!",
                });
            }
            const findIdBoothType = await boothTypeModel.findOne({
                _id: id_booth_type,
            });
            if (!findIdBoothType) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid booth type!",
                });
            }
            const listImage = req.listImage;
            //console.log("listImage:", listImage);
            if (id_business === id_business_product) {
                const newBothProduct = await boothProductModel({
                    id_businessType: findIdBusinessType._id,
                    id_boothType: findIdBoothType._id,
                    id_user: id_user,
                    nameBooth: nameBooth,
                    desc: desc,
                    shortDesc: shortDesc,
                    statusReseller: statusReseller,
                    discountProduct: discount,
                    imageBooth: listImage,
                });
                const saveNewBothProduct = await newBothProduct.save();
                return res.status(200).json({
                    success: true,
                    message: "Create booth successfully.",
                    data: saveNewBothProduct,
                });
            }
            if (id_business === id_business_service) {
                const newBothService = await boothServiceModel({
                    id_businessType: findIdBusinessType._id,
                    id_boothType: findIdBoothType._id,
                    id_user: id_user,
                    nameBooth: nameBooth,
                    desc: desc,
                    shortDesc: shortDesc,
                    statusReseller: statusReseller,
                    discountService: discount,
                    imageBooth: listImage,
                });
                const saveNewBothService = await newBothService.save();
                return res.status(200).json({
                    success: true,
                    message: "Create booth successfully.",
                    data: saveNewBothService,
                });
            }
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    },
    //Lấy gian hàng theo địa chỉ của agent (Agent)
    getAllBoothByUser: async (req, res) => {
        try {
            const id_user = req.params._id;
            const [boothProduct, boothService] = await Promise.all([
                boothProductModel
                    .find({ id_user: id_user })
                    .populate([
                        { path: "id_businessType" },
                        { path: "id_boothType" },
                        { path: "id_user" },
                        { path: "detailBooth" },
                    ]),
                boothServiceModel
                    .find({ id_user: id_user })
                    .populate([
                        { path: "id_businessType" },
                        { path: "id_boothType" },
                        { path: "id_user" },
                        { path: "detailBooth" },
                    ]),
            ]);
            console.log(boothProduct);
            return res.status(200).json({
                success: true,
                data: [boothProduct, boothService],
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    },
    //Lấy gian hàng theo địa chỉ của một gian hàng
    getBoothByIdBooth: async (req, res) => {
        try {
            const id_business = req.query.id_business;
            const id_booth = req.query.id_booth;
            let find_booth;
            if (id_business === process.env.ID_BUSINESS_PRODUCT) {
                find_booth = await boothProductModel
                    .findOne({ _id: id_booth })
                    .populate([
                        { path: "id_businessType" },
                        { path: "id_boothType" },
                        { path: "id_user" },
                        { path: "detailBooth" },
                    ]);
            } else if (id_business === process.env.ID_BUSINESS_SERVICE) {
                find_booth = await boothServiceModel
                    .findOne({ _id: id_booth })
                    .populate([
                        { path: "id_businessType" },
                        { path: "id_boothType" },
                        { path: "id_user" },
                        { path: "detailBooth" },
                    ]);
            } else {
                return res.status(400).json({
                    success: false,
                    message: "Invalid id_business value",
                });
            }

            if (!find_booth) {
                return res.status(404).json({
                    success: false,
                    message: "Booth not found",
                });
            }
            return res.status(200).json({
                success: true,
                data: find_booth,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    },
    updateBooth: async (req, res) => {
        try {
            const {
                id_businessType,
                id_booth,
                nameBooth,
                desc,
                shortDesc,
                statusReseller,
            } = req.body;
            console.log(req.body);
            let updatedBooth;
            let imageBooth;
            console.log("+++++++++++++++");
            console.log(req.listImage[0]);
            if (req.listImage) {
                console.log("==================");
                imageBooth = req.listImage[0];
            }
            console.log("imageBooth:", imageBooth);
            if (id_businessType === process.env.ID_BUSINESS_PRODUCT) {
                const newBoothProduct = new boothProductModel({
                    nameBooth: nameBooth,
                    desc: desc,
                    shortDesc: shortDesc,
                    // imageBooth: imageBooth,
                    statusReseller: statusReseller,
                });
                console.log("newBoothProduct:", newBoothProduct);
                // if (imageBooth) {
                //     console.log("}}}}}}}}}}}}}}}");
                //     newBoothProduct.imageBooth = imageBooth;
                // }
                updatedBooth = await boothProductModel.findOneAndUpdate(
                    { _id: id_booth },
                    {
                        nameBooth: nameBooth,
                        desc: desc,
                        shortDesc: shortDesc,
                        imageBooth: imageBooth,
                        statusReseller: statusReseller,
                    },
                    { new: true }
                );
                // if (imageBooth) {
                //     console.log("}}}}}}}}}}}}}}}");
                //     newBoothProduct.imageBooth = imageBooth;
                // }
            } else if (id_businessType === process.env.ID_BUSINESS_SERVICE) {
                const newBoothProduct = await new boothServiceModel({
                    nameBooth: nameBooth,
                    desc: desc,
                    shortDesc: shortDesc,
                    imageBooth: imageBooth,
                    statusReseller: statusReseller,
                });
                if (imageBooth) {
                    newBoothProduct.imageBooth = imageBooth;
                }
                updatedBooth = await boothServiceModel.findOneAndUpdate(
                    { _id: id_booth },
                    {
                        nameBooth: nameBooth,
                        desc: desc,
                        shortDesc: shortDesc,
                        imageBooth: imageBooth,
                        statusReseller: statusReseller,
                    },
                    { new: true }
                );
            } else {
                return res.status(400).json({
                    success: false,
                    message: "Invalid id_businessType value",
                });
            }
            if (!updatedBooth) {
                return res.status(404).json({
                    success: false,
                    message: "Booth not found",
                });
            }
            return res.status(200).json({
                success: true,
                data: updatedBooth,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    },
    deleteBooth: async (req, res) => {
        try {
            const { id_booth, id_business } = req.body;
            if (id_business === process.env.ID_BUSINESS_PRODUCT) {
                // const findBooth = await boothProductModel.findOne({
                //     _id: id_booth,
                // });
                // for (const booth of findBooth.detailBooth) {
                //     await detailBoothProductModel.findByIdAndDelete(booth._id);
                // }
                // await boothProductModel.findByIdAndDelete(id_booth);
                const findBooth = await boothProductModel.findOne({
                    _id: id_booth,
                });

                if (!findBooth) {
                    console.log("Booth not found");
                    return;
                }
                const deleteDetailBoothPromises = findBooth.detailBooth.map(
                    (boothId) =>
                        detailBoothProductModel.findByIdAndDelete(boothId)
                );
                await Promise.all(deleteDetailBoothPromises);
                await boothProductModel.findByIdAndDelete(id_booth);
            } else if (id_business === process.env.ID_BUSINESS_SERVICE) {
                // const findBooth = await boothServiceModel.findOne({
                //     _id: id_booth,
                // });
                // for (const booth of findBooth.detailBooth) {
                //     await detailBoothServiceModel.findByIdAndDelete(booth._id);
                // }
                // await boothProductModel.findByIdAndDelete(id_booth);
                const findBooth = await boothServiceModel.findOne({
                    _id: id_booth,
                });

                if (!findBooth) {
                    console.log("Booth not found");
                    return;
                }
                const deleteDetailBoothPromises = findBooth.detailBooth.map(
                    (boothId) =>
                        detailBoothProductModel.findByIdAndDelete(boothId)
                );
                await Promise.all(deleteDetailBoothPromises);
                await boothServiceModel.findByIdAndDelete(id_booth);
            }
            return res.status(200).json({
                success: true,
                message: "Delete detail booth successfully!",
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    },
    paginationDiscount: async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const id_discount = req.query.id_discount;
            const id_business = req.query.id_business;
            const businessProduct = process.env.ID_BUSINESS_PRODUCT;

            const skip = (page - 1) * limit;
            const query = {
                [id_business === businessProduct
                    ? "discountProduct"
                    : "discountService"]: id_discount,
            };
            const model =
                id_business === businessProduct
                    ? boothProductModel
                    : boothServiceModel;
            const findBooth = await model.find(query).skip(skip).limit(limit);
            const total = await model.countDocuments(query);
            return res.status(200).json({
                success: true,
                data: findBooth,
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
    searchBooth: async (req, res) => {
        try {
            // const search = req.query.search;
            // const type = req.query.type;
            // if (type.trim() === "") {
            //     const [boothProduct, boothService] = await Promise.all([
            //         boothProductModel.find({
            //             nameBooth: {
            //                 $regex: ".*" + search + ".*",
            //                 $options: "i",
            //             },
            //         }),
            //         boothServiceModel.find({
            //             nameBooth: {
            //                 $regex: ".*" + search + ".*",
            //                 $options: "i",
            //             },
            //         }),
            //     ]);
            //     return res.status(200).json({
            //         success: true,
            //         data: { boothProduct, boothService },
            //     });
            // }
            // const [boothProduct, boothService] = await Promise.all([
            //     boothProductModel.find({
            //         nameBooth: {
            //             $regex: ".*" + search + ".*",
            //             $options: "i",
            //         },
            //         id_boothType: type,
            //     }),
            //     boothServiceModel.find({
            //         nameBooth: {
            //             $regex: ".*" + search + ".*",
            //             $options: "i",
            //         },
            //         id_boothType: type,
            //     }),
            // ]);
            // return res.status(200).json({
            //     success: true,
            //     data: { boothProduct, boothService },
            // });
            const { search, type } = req.query;
            const query = {
                nameBooth: { $regex: ".*" + search + ".*", $options: "i" },
            };
            if (type && type.trim() !== "") {
                query.id_boothType = type;
            }
            const [boothProduct, boothService] = await Promise.all([
                boothProductModel
                    .find(query)
                    .populate({ path: "detailBooth" })
                    .populate({ path: "id_boothType" })
                    .populate({ path: "id_user" })
                    .populate({ path: "id_businessType" }),
                boothServiceModel
                    .find(query)
                    .populate({ path: "detailBooth" })
                    .populate({ path: "id_boothType" })
                    .populate({ path: "id_user" })
                    .populate({ path: "id_businessType" }),
            ]);

            return res.status(200).json({
                success: true,
                data: { boothProduct, boothService },
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    },
};
module.exports = boothController;
