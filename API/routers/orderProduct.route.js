const express = require("express");
const orderProductController = require("../controllers/orderProduct.controller");
const orderProductRouter = express.Router();

orderProductRouter.get(
    "/api/order/product/:_id",
    orderProductController.getByIdOrderProduct
);
orderProductRouter.get(
    "/api/order/product",
    orderProductController.getAllOrderProduct
);
orderProductRouter.get(
    "/api/order/product/agent/:_id",
    orderProductController.getOrderProductByUserAgent
);
orderProductRouter.get(
    "/api/order/product/by/user/:_id",
    orderProductController.getOrderProductByUser
);
orderProductRouter.put(
    "/api/order/product/update/approved/:_id",
    orderProductController.updateStatusApprovedProduct
);
orderProductRouter.put(
    "/api/order/product/update/cancel/:_id",
    orderProductController.updateStatusCancelProduct
);
orderProductRouter.put(
    "/api/order/product/update/completed/:_id",
    orderProductController.updateStatusCompletedProduct
);

module.exports = orderProductRouter;
