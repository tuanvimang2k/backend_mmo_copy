const express = require("express");
const couponRouter = express.Router();
const couponController = require("../controllers/coupon.controller");

couponRouter.post("/api/save/coupon", couponController.saveCoupon);
couponRouter.put("/api/update/coupon/:_id", couponController.updateCoupon);
couponRouter.delete("/api/delete/coupon", couponController.deleteCoupon);
couponRouter.get("/api/coupon/user/:_id", couponController.getAllCouponByUser);
couponRouter.get("/api/coupon/:_id", couponController.getCouponByIdCoupon);
couponRouter.get(
    "/api/coupon/completed/:_id",
    couponController.getCouponByUserCompleted
);
couponRouter.get(
    "/api/coupon/upcoming/:_id",
    couponController.getCouponByUserUpcoming
);
couponRouter.get(
    "/api/coupon/active/:_id",
    couponController.getCouponByUserActive
);

module.exports = couponRouter;
