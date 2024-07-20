const express = require("express");
const balanceUserRouter = express.Router();
const balanceUserController = require("../controllers/balanceUser.controller");

balanceUserRouter.put(
    "/api/update/balance/:_id",
    balanceUserController.updateBalanceBanking
);
balanceUserRouter.put(
    "/api/update/balance/w3/:_id",
    balanceUserController.updateBalanceW3
);
balanceUserRouter.get("/api/all/balance", balanceUserController.getAllBalance);
balanceUserRouter.get(
    "/api/balance/by/id/user/:_id",
    balanceUserController.getBalanceByIdUser
);

module.exports = balanceUserRouter;
