const userModel = require("../../models/user.model");
const tokenModel = require("../../models/token.model");
const sendEmail = require("../../utils/sendEmail.utils");
const crypto = require("crypto");

const sendEmailController = {
    verifyEmail: async (req, res) => {
        try {
            const user = await userModel.findOne({ _id: req.params._id });
            if (!user) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid link",
                });
            }
            const token = await tokenModel.findOne({
                userId: user._id,
                token: req.params.token,
            });
            if (!token) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid link",
                });
            }
            const currentDate = new Date();
            console.log("currentDate:", currentDate);
            if (
                currentDate >= token.createdAt &&
                currentDate <= token.validityPeriod
            ) {
                console.log("=================");
                await userModel.findOneAndUpdate(
                    { _id: user._id },
                    { verify: true },
                    { new: true }
                );
                await tokenModel.findOneAndDelete({ userId: user._id });
                return res
                    .status(200)
                    .send({ message: "Email verified successfully." });
            } else {
                return res
                    .status(400)
                    .send("The email verification link has expired.");
            }
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    },
    sendBackToken: async (req, res) => {
        try {
            const _id = req.body._id;
            const findToken = await tokenModel.findOneAndDelete({ _id: _id });
            const createdAt = new Date();
            const validityPeriod = new Date(
                createdAt.getTime() + 15 * 60 * 1000
            );
            const token = await new tokenModel({
                userId: _id,
                token: crypto.randomBytes(32).toString("hex"),
                createdAt: createdAt,
                validityPeriod: validityPeriod,
            }).save();
            const findUser = await userModel.findOne({ _id: _id });
            const url = `
            Hey ${findUser.gmail}

            ${process.env.BASE_URL}users/${findUser._id}/verify/${token.token}
            Thanks,
            The MMO Web3 Team`;
            await sendEmail(findUser.gmail, "Verify Email", url);
            return res.status(201).send({
                message: "An Email sent to your account please verify",
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    },
};
module.exports = sendEmailController;
