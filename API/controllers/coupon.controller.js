const moment = require("moment");
const momentTimeZone = require("moment-timezone");
const couponModel = require("../../models/coupon.model");
const boothProductModel = require("../../models/boothProduct.model");
const boothServiceModel = require("../../models/boothService.model");

const couponController = {
    saveCoupon: async (req, res) => {
        try {
            //code có 6 kí tự, chuyển đổi hết thành chữ thường
            const id_business_product = process.env.ID_BUSINESS_PRODUCT;
            const id_business_service = process.env.ID_BUSINESS_SERVICE;
            const {
                code,
                numberPromo,
                percent,
                startDate,
                endDate,
                id_booth,
                id_business,
                id_user,
            } = req.body;
            const start = moment(startDate, "DD-MM-YYYY HH:mm", "Asia/Bangkok");
            const end = moment(endDate, "DD-MM-YYYY HH:mm", "Asia/Bangkok");
            if (id_business === id_business_product) {
                const find_booth = await boothProductModel.findOne({
                    _id: id_booth,
                });
                if (!find_booth) {
                    return res.status(400).json({
                        success: false,
                        message: "The booth not found!",
                    });
                }
                const newPromo = new couponModel({
                    code: code,
                    numberPromo: numberPromo,
                    percent: percent,
                    startDate: start,
                    endDate: end,
                    id_boothProduct: find_booth._id,
                    id_boothService: null,
                    id_business: id_business,
                    id_user: id_user,
                });
                const savePromo = await newPromo.save();
                return res.status(200).json({
                    success: true,
                    data: savePromo,
                });
            }
            if (id_business === id_business_service) {
                const find_booth = await boothServiceModel.findOne({
                    _id: id_booth,
                });
                if (!find_booth) {
                    return res.status(400).json({
                        success: false,
                        message: "The booth not found!",
                    });
                }
                const newPromo = new couponModel({
                    code: code,
                    numberPromo: numberPromo,
                    percent: percent,
                    startDate: start,
                    endDate: end,
                    id_boothProduct: null,
                    id_boothService: find_booth._id,
                    id_business: id_business,
                    id_user: id_user,
                });
                const savePromo = await newPromo.save();
                return res.status(200).json({
                    success: true,
                    data: savePromo,
                });
            }
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    },
    updateCoupon: async (req, res) => {
        try {
            //Không cho cập nhật gian hàng muốn áp dụng mã
            const id_coupon = req.params._id;
            const { startDate, endDate, percent, numberPromo } = req.body;
            const findCoupon = await couponModel.findById(id_coupon);
            // console.log(findCoupon);
            if (!findCoupon) {
                return res.status(404).json({
                    success: false,
                    message: "The id promo not found!",
                });
            }
            const now = moment();
            // console.log(now);
            const startCoupon = moment(findCoupon.startDate).tz("Asia/Bangkok");
            // console.log(startCoupon);
            const endCoupon = moment(findCoupon.endDate).tz("Asia/Bangkok");
            // console.log(endCoupon);
            if (now.isBetween(startCoupon, endCoupon)) {
                return res.status(400).json({
                    success: false,
                    message:
                        "This coupon is in time, please delete coupon if you want update this coupon!",
                });
            }
            const updateData = {
                percent: percent,
                numberPromo: numberPromo,
                startDate: moment.tz(
                    startDate,
                    "DD-MM-YYYY HH:mm",
                    "Asia/Bangkok"
                ),
                endDate: moment.tz(endDate, "DD-MM-YYYY HH:mm", "Asia/Bangkok"),
            };
            const updatedCoupon = await couponModel.findOneAndUpdate(
                { _id: id_coupon },
                updateData,
                { new: true }
            );
            return res.status(200).json({
                success: true,
                message: "Updated coupon successfully.",
                data: updatedCoupon,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    },
    deleteCoupon: async (req, res) => {
        try {
            const deleteCoupon = await couponModel.findByIdAndDelete(
                req.body._id
            );
            if (deleteCoupon) {
                return res.status(200).json({
                    success: true,
                    message: "Coupon is deleted!",
                });
            } else {
                return res.status(404).json({
                    success: false,
                    message: "Coupon not found!",
                });
            }
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    },
    getAllCouponByUser: async (req, res) => {
        try {
            const id_user = req.params._id;
            const find = await couponModel
                .find({ id_user: id_user })
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
    getCouponByIdCoupon: async (req, res) => {
        try {
            const id_coupon = req.params._id;
            const find = await couponModel
                .findById(id_coupon)
                .populate({ path: "id_boothProduct" })
                .populate({ path: "id_boothService" });
            if (!find) {
                return res.status(400).json({
                    success: false,
                    message: "The coupon not found!",
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
    getCouponByUserCompleted: async (req, res) => {
        try {
            const id_user = req.params._id;
            const findCoupon = await couponModel
                .find({ id_user: id_user })
                .populate({ path: "id_boothProduct" })
                .populate({ path: "id_boothService" });
            const currentDate = moment();
            const checkCouponCompleted = findCoupon.filter((coupon) => {
                const endDate = moment(coupon.endDate).tz("Asia/Bangkok");
                return currentDate.isAfter(endDate);
            });
            if (checkCouponCompleted.length == 0) {
                return res.status(404).json({
                    success: false,
                    message: "No completed coupon found!",
                });
            }
            return res.status(200).json({
                success: true,
                data: checkCouponCompleted,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    },
    getCouponByUserActive: async (req, res) => {
        try {
            const id_user = req.params._id;
            const findCoupon = await couponModel
                .find({ id_user: id_user })
                .populate({ path: "id_boothProduct" })
                .populate({ path: "id_boothService" });
            const currentDate = moment();
            const checkCouponCompleted = findCoupon.filter((coupon) => {
                const startDate = moment(coupon.startDate).tz("Asia/Bangkok");
                const endDate = moment(coupon.endDate).tz("Asia/Bangkok");
                return currentDate.isBetween(startDate, endDate);
            });
            if (checkCouponCompleted.length == 0) {
                return res.status(404).json({
                    success: false,
                    message: "No completed coupon found!",
                });
            }
            return res.status(200).json({
                success: true,
                data: checkCouponCompleted,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    },
    getCouponByUserUpcoming: async (req, res) => {
        try {
            const id_user = req.params._id;
            const findCoupon = await couponModel
                .find({ id_user: id_user })
                .populate({ path: "id_boothProduct" })
                .populate({ path: "id_boothService" });
            const currentDate = moment();
            const checkCouponCompleted = findCoupon.filter((coupon) => {
                const startDate = moment(coupon.startDate).tz("Asia/Bangkok");
                return currentDate.isBefore(startDate);
            });
            if (checkCouponCompleted.length == 0) {
                return res.status(404).json({
                    success: false,
                    message: "No completed coupon found!",
                });
            }
            return res.status(200).json({
                success: true,
                data: checkCouponCompleted,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    },
};
module.exports = couponController;
