const userModel = require("../../models/user.model");
const affiliateController = require("./affiliate.controller");
const authController = require("./auth.controller");
const linkRefController = require("./linkRef.controller");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const balanceUserController = require("./balanceUser.controller");
const refSystemModel = require("../../models/refSystem.model");
const tokenModel = require("../../models/token.model");
const sendEmail = require("../../utils/sendEmail.utils");
const crypto = require("crypto");
// const { now } = require("mongoose");
const affiliateModel = require("../../models/affiliate.model");
const balanceModel = require("../../models/balanceUser.model");
const balanceW3Model = require("../../models/balanceW3.model");

const siteController = {
    postLogin: async (req, res) => {
        try {
            const gmail = req.body.gmail;
            const password = req.body.password;
            const existingEmail = await userModel.findOne({ gmail: gmail });
            if (!existingEmail) {
                return res.status("404").json({
                    success: false,
                    message: "You're not registered!",
                });
            }
            const validPassword = await bcrypt.compare(
                password,
                existingEmail.password
            );
            if (!validPassword) {
                return res.status("404").json({
                    success: false,
                    message: "Wrong password!",
                });
            }
            if (existingEmail && validPassword) {
                const accessToken =
                    authController.generateAccessToken(existingEmail);
                const refreshToken =
                    authController.generateRefreshToken(existingEmail);
                // res.cookie("refreshToken", refreshToken, {
                //     httpOnly: true,
                //     secure: false,
                //     path: "/",
                //     sameSite: "strict",
                // });
                await userModel.findOneAndUpdate(
                    { gmail: gmail },
                    { refreshToken: refreshToken },
                    { new: true }
                );
                const { password, ...others } = existingEmail._doc;
                return res.status(200).json({
                    message: "Logged in successfully.",
                    user: { ...others, accessToken, refreshToken },
                });
            }
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    },
    postLoginGoogle: async (req, res) => {
        try {
            const { gmail, username } = req.body;
            const findGmail = await userModel.findOne({ gmail: gmail });
            if (!findGmail) {
                const newUser = new userModel({
                    username: username,
                    gmail: gmail,
                    role: "user",
                    refreshToken: null,
                    method: "google",
                    verify: true,
                });
                const saveUser = await newUser.save();
                //start user
                await balanceUserController.startBalanceUser(saveUser._id);
                const accessToken =
                    authController.generateAccessToken(saveUser);
                const refreshToken =
                    authController.generateRefreshToken(saveUser);
                await userModel.findOneAndUpdate(
                    { gmail: gmail },
                    { refreshToken: refreshToken },
                    { new: true }
                );
                return res.status(200).json({
                    message: "Logged in successfully.",
                    user: { saveUser, accessToken, refreshToken },
                });
            }
            if (
                findGmail.method === "google" ||
                findGmail.method === "client"
            ) {
                const accessToken =
                    authController.generateAccessToken(findGmail);
                const refreshToken =
                    authController.generateRefreshToken(findGmail);
                await userModel.findOneAndUpdate(
                    { gmail: gmail },
                    { refreshToken: refreshToken },
                    { new: true }
                );
                return res.status(200).json({
                    message: "Logged in successfully.",
                    user: { findGmail, accessToken, refreshToken },
                });
            }
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    },
    postSignUpUser: async (req, res) => {
        try {
            const { username, gmail, password, affiliate } = req.body;
            console.log("affiliate:", affiliate);
            const find = await userModel.findOne({
                gmail: gmail,
                verify: false,
            });
            if (find) {
                await Promise.all([
                    tokenModel.findOneAndDelete({ userId: find._id }),
                    userModel.findOneAndDelete({
                        gmail: gmail,
                        verify: false,
                    }),
                    balanceModel.findOneAndDelete({ id_user: find._id }),
                    balanceW3Model.findOneAndDelete({ id_user: find._id }),
                    affiliateModel.findOneAndDelete({ userChild: find.gmail }),
                ]);
            }
            const findGmail = await userModel.findOne({
                gmail: gmail,
                verify: true,
            });
            if (findGmail) {
                return res.status(400).json({
                    success: false,
                    message: "Gmail is existed!",
                });
            }
            const findUsername = await userModel.findOne({
                username: username,
                verify: true,
            });
            if (findUsername) {
                return res.status(400).json({
                    success: false,
                    message: "Username is existed!",
                });
            }

            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash(password, salt);
            const newUser = await new userModel({
                username: username,
                gmail: gmail,
                password: hashPassword,
                role: "user",
                refreshToken: null,
                method: "client",
            });
            const saveUser = await newUser.save();
            const createdAt = new Date();
            const validityPeriod = new Date(
                createdAt.getTime() + 15 * 60 * 1000
            );
            const token = await new tokenModel({
                userId: saveUser._id,
                token: crypto.randomBytes(32).toString("hex"),
                createdAt: createdAt,
                validityPeriod: validityPeriod,
            }).save();
            //
            if (affiliate) {
                console.log("===========================");
                const find = await affiliateController.saveAffiliate(
                    affiliate,
                    newUser.gmail
                );
                if (find === false) {
                    return res.status(400).json({
                        success: false,
                        message: "LinkRef not found!",
                    });
                }
            }

            const linkRef = await linkRefController.createHref();
            newUser.linkRef = linkRef.codeRef;
            console.log(linkRef.link);
            await newUser.save();
            await balanceUserController.startBalanceUser(saveUser._id);
            //
            const url = ` 
            Hey ${saveUser.gmail}

            To complete the sign up, Please visit the link below:
            ${process.env.BASE_URL}users/${saveUser._id}/verify/${token.token}
            
            Thanks,
            The MMO Web3 Team
            `;
            await sendEmail(saveUser.gmail, "Verify Email", url);
            return res.status(201).send({
                message: "An Email sent to your account please verify",
            });
            // if (affiliate) {
            //     console.log("===========================");
            //     await affiliateController.saveAffiliate(
            //         affiliate,
            //         newUser.gmail
            //     );
            // }

            // const linkRef = await linkRefController.createHref(saveUser.gmail);
            // newUser.linkRef = linkRef;
            // await newUser.save();
            // await balanceUserController.startBalanceUser(saveUser._id);

            // return res.status(200).json({
            //     success: true,
            //     message: "Create user successfully",
            // });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    },
    updateTotalReward: async (result, total) => {
        const find = result.forEach(async (result) => {
            const user = await refSystemModel.findOne({ level: result.level });
            if (user) {
                const findUser = await userModel.findOne({
                    gmail: result.gmail,
                });
                const totalReward =
                    findUser.totalRewardOrder + (user.income * total) / 100;
                await userModel.findOneAndUpdate(
                    { gmail: findUser.gmail },
                    { totalRewardOrder: totalReward },
                    { new: true }
                );
            }
        });
        return `Updated successfully!`;
    },
    getAllUser: async (req, res) => {
        try {
            const findAllUser = await userModel.find();
            return res.status(200).json({
                success: true,
                data: findAllUser,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    },
    getIdUser: async (req, res) => {
        try {
            const _id = req.params._id;
            const getIdUser = await userModel.findById(_id);
            return res.status(200).json({
                success: true,
                data: getIdUser,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    },
    updateRoleUser: async (id_user) => {
        const find = await userModel.findOneAndUpdate(
            { _id: id_user },
            { role: "agent" },
            { new: true }
        );
        return find;
    },
    //true/false
    updateStatusUser: async (req, res) => {
        try {
            const updateUser = await userModel.findOneAndUpdate(
                { _id: req.params._id },
                { status: req.body.status },
                { new: true }
            );
            return res.status(200).json({
                success: true,
                data: updateUser,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    },
    updatePassword: async (req, res) => {
        try {
            const password = req.body.password;
            const _id = req.params._id;
            const findUser = await userModel.findOne({
                _id: _id,
                method: "client",
            });
            if (!findUser) {
                return res.status(404).json({
                    success: false,
                    message: "The user not found!",
                });
            }
            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash(password, salt);
            findUser.password = hashPassword;
            await findUser.save();
            return res.status(200).json({
                success: true,
                message: "Updated password successfully.",
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    },
};
module.exports = siteController;
