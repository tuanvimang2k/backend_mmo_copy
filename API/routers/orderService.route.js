const express = require("express");
const orderServiceController = require("../controllers/orderService.controller");
const orderServiceRouter = express.Router();

orderServiceRouter.get(
    "/api/order/service/:_id",
    orderServiceController.getByIdOrderService
);
orderServiceRouter.get(
    "/api/order/service",
    orderServiceController.getAllOrderService
);
orderServiceRouter.get(
    "/api/order/service/agent/:_id",
    orderServiceController.getOrderServiceByUserAgent
);
orderServiceRouter.get(
    "/api/order/service/by/user/:_id",
    orderServiceController.getOrderServiceByUser
);
orderServiceRouter.put(
    "/api/order/service/update/approved/:_id",
    orderServiceController.updateStatusApprovedService
);
orderServiceRouter.put(
    "/api/order/service/update/cancel/:_id",
    orderServiceController.updateStatusCancelService
);
orderServiceRouter.put(
    "/api/order/service/update/completed/:_id",
    orderServiceController.updateStatusCompletedService
);
module.exports = orderServiceRouter;
