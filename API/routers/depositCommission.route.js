const express = require("express");
const depositCommissionConfigRouter = express.Router();
const depositCommissionConfigController = require("../controllers/depositCommissionConfig.controller");

depositCommissionConfigRouter.post(
    "/api/create/deposit/commission",
    depositCommissionConfigController.createDeposit
);
depositCommissionConfigRouter.put(
    "/api/update/deposit/commission/:_id",
    depositCommissionConfigController.updateDeposit
);
depositCommissionConfigRouter.get(
    "/api/all/deposit/commission",
    depositCommissionConfigController.getAllDeposit
);
depositCommissionConfigRouter.get(
    "/api/deposit/commission/:_id",
    depositCommissionConfigController.getIdDepositCommission
);

module.exports = depositCommissionConfigRouter;
