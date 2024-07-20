const express = require("express");
const withdrawRouter = express.Router();
const withdrawController = require("../controllers/withdraw.controller");

withdrawRouter.post("/api/withdraw", withdrawController.saveDrawUser);
withdrawRouter.put(
    "/api/update/status/withdraw",
    withdrawController.updateStatusWithDraw
);
withdrawRouter.get(
    "/api/all/history/by/user/:_id",
    withdrawController.getHistoryWithdraw
);
withdrawRouter.get(
    "/api/withdraw/by/:_id",
    withdrawController.getHistoryByIdWithdraw
);
withdrawRouter.get(
    "/api/all/withdraw",
    withdrawController.getAllHistoryWithdraw
);

module.exports = withdrawRouter;
