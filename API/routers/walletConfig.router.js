const express = require("express");
const walletConfigRouter = express.Router();
const walletConfigController = require("../controllers/walletConfig.controller");
const tokenMiddleware = require("../../middlewares/token.middleware");

walletConfigRouter.post(
    "/api/create/wallet",
    tokenMiddleware.verifyTokenAndAdmin,
    walletConfigController.createWallet
);
walletConfigRouter.put(
    "/api/update/wallet/:_id",
    tokenMiddleware.verifyTokenAndAdmin,
    walletConfigController.updateWallet
);
walletConfigRouter.get("/api/all/wallet", walletConfigController.getAllWallet);
walletConfigRouter.delete(
    "/api/delete/wallet/:_id",
    walletConfigController.deleteWallet
);
walletConfigRouter.get("/api/wallet/:_id", walletConfigController.getIdWallet);
module.exports = walletConfigRouter;
