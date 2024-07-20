const express = require("express");
const resellerRouter = express.Router();
const resellerController = require("../controllers/reseller.controller");

resellerRouter.post("/api/new/reseller", resellerController.saveReseller);
resellerRouter.get(
    "/api/reseller/agent/:_id",
    resellerController.getResellerByIdUserAgent
);
resellerRouter.put(
    "/api/reseller/status/approved/:_id",
    resellerController.updateStatusResellerApproved
);
resellerRouter.put(
    "/api/reseller/status/cancel/:_id",
    resellerController.updateStatusResellerCancel
);
resellerRouter.get(
    "/api/reseller/agent/status",
    resellerController.getResellerByUserAgentStatus
);
resellerRouter.get("/api/reseller/:_id", resellerController.getOrderReseller);
resellerRouter.get(
    "/api/reseller/id/reseller/:_id",
    resellerController.getIdReseller
);
resellerRouter.get(
    "/api/reseller/and/booth",
    resellerController.getIdResellerBooth
);
module.exports = resellerRouter;
