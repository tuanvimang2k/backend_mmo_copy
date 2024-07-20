const express = require("express");
const litigiousRouter = express.Router();
const litigiousController = require("../controllers/litigious.controller");

litigiousRouter.put(
    "/api/update/order/status",
    litigiousController.updateStatusComplain
);
litigiousRouter.post(
    "/api/refund/litigious",
    litigiousController.refundLitigious
);
litigiousRouter.put(
    "/api/refund/dispute",
    litigiousController.updateStatusDispute
);

module.exports = litigiousRouter;
