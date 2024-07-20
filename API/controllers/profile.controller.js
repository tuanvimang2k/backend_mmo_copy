const { default: mongoose } = require("mongoose");
const profileModel = require("../../models/profile.model");
const userModel = require("../../models/user.model");
const balanceModel = require("../../models/balanceUser.model");
const balanceW3Model = require("../../models/balanceW3.model");
const boothProductModel = require("../../models/boothProduct.model");
const boothServiceModel = require("../../models/boothService.model");
const orderProductModel = require("../../models/orderProduct.model");
const orderServiceModel = require("../../models/orderService.model");
const blogModel = require("../../models/blog.model");
const profileController = {
    saveProfile: async (req, res) => {
        try {
            const { lastName, firstName, phone, description, idUser } =
                req.body;
            const findUser = await userModel.findOne({ _id: idUser });
            if (!findUser) {
                return res.status(400).json({
                    success: false,
                    message: "The user not found. Please sign up!",
                });
            }
            let listImage;
            if (req.listImage) {
                listImage = req.listImage;
            }
            const newProfile = await new profileModel({
                lastName: lastName,
                firstName: firstName,
                phone: phone,
                description: description,
                userId: idUser,
                imageProfile: listImage,
            });
            const saveProfile = await newProfile.save();
            return res.status(200).json({
                success: true,
                data: saveProfile,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    },
    getAllProfile: async (req, res) => {
        try {
            const getAllProfile = await profileModel.find();
            return res.status(200).json({
                success: true,
                data: getAllProfile,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    },
    getIdProfile: async (req, res) => {
        try {
            const _id = req.params._id;
            if (!mongoose.Types.ObjectId.isValid(_id)) {
                return res.status("404").json({
                    success: false,
                    message: `The profile with id ${_id} not found!`,
                });
            }
            const findIdProfile = await profileModel.findById({ _id: _id });
            return res.status(200).json({
                success: true,
                data: findIdProfile,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    },
    updateProfile: async (req, res) => {
        try {
            const { lastName, firstName, phone, description } = req.body;
            const _id = req.params._id;
            if (!mongoose.Types.ObjectId.isValid(_id)) {
                return res.status("404").json({
                    success: false,
                    message: `The profile with id ${_id} not found!`,
                });
            }
            let imageProfile;
            if (req.listImage) {
                imageProfile = req.listImage[0];
            }
            const conditionProfile = await profileModel.findOne({ _id: _id });
            const updateDataProfile = {
                lastName: lastName,
                firstName: firstName,
                phone: phone,
                description: description,
                imageProfile: imageProfile,
            };
            const updateProfile = await profileModel.findOneAndUpdate(
                conditionProfile,
                updateDataProfile,
                { new: true }
            );
            return res.status(200).json({
                success: true,
                message: `The profile with ${_id} updated successfully`,
                data: updateProfile,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    },
    getDetailProfile: async (req, res) => {
        try {
            const _id = req.params._id;
            console.log(_id);
            const [
                findBalanceUser,
                findBalanceW3,
                findProfile,
                findOrderProduct,
                findOrderService,
                findBoothProduct,
                findBoothService,
                findSoldProduct,
                findSoldService,
                findBlog,
            ] = await Promise.all([
                balanceModel.findOne({ id_user: _id }),
                balanceW3Model.findOne({ id_user: _id }),
                profileModel.findOne({ userId: _id }),
                orderProductModel.find({ id_user: _id }),
                orderServiceModel.find({ id_user: _id }),
                boothProductModel.find({ id_user: _id }),
                boothServiceModel.find({ id_user: _id }),
                orderProductModel.find({ id_seller: _id }),
                orderServiceModel.find({ id_seller: _id }),
                blogModel.find({ id_user: _id }),
            ]);
            // console.log("findBalanceUser:", findBalanceUser);
            // console.log("findBalanceW3:", findBalanceW3);
            // console.log("findOrderProduct:", findBoothProduct);
            // console.log(findBoothProduct.length);
            // console.log("findOrderService:", findBoothService);
            // console.log(findBoothService.length);
            // console.log("findProfile:", findProfile);
            const balance = findBalanceUser.balance + findBalanceW3.balance;
            const order =
                (findOrderProduct ? findOrderProduct.length : 0) +
                (findOrderService ? findOrderService.length : 0);
            const booth =
                (findBoothProduct ? findBoothProduct.length : 0) +
                (findBoothService ? findBoothService.length : 0);
            const soldBooth =
                (findSoldProduct ? findSoldProduct.length : 0) +
                (findSoldService ? findSoldService.length : 0);
            const blog = findBlog ? findBlog.length : 0;
            return res.status(200).json({
                success: true,
                data: {
                    balance: balance,
                    order: order,
                    booth: booth,
                    profile: findProfile,
                    soldBooth: soldBooth,
                    blog: blog,
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
module.exports = profileController;
