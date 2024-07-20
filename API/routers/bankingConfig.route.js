const express = require("express");
const bankingConfigRouter = express.Router();
const bankingConfigController = require("../controllers/bankingConfig.controller");

bankingConfigRouter.post(
    "/api/create/banking",
    bankingConfigController.saveBanking
);
bankingConfigRouter.put(
    "/api/update/banking/:_id",
    bankingConfigController.updateBanking
);
bankingConfigRouter.get(
    "/api/all/banking",
    bankingConfigController.getAllBanking
);
bankingConfigRouter.get(
    "/api/banking/:_id",
    bankingConfigController.getIdBanking
);
bankingConfigRouter.delete(
    "/api/banking/delete/:_id",
    bankingConfigController.deleteBankingConfig
);

module.exports = bankingConfigRouter;
