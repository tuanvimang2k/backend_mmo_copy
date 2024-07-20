const express = require("express");
const businessTypeRouter = express.Router();
const businessTypeController = require("../controllers/businessType.controller");

businessTypeRouter.post(
    "/api/business/type",
    businessTypeController.createBusinessType
);
businessTypeRouter.put(
    "/api/update/business/type/:_id",
    businessTypeController.updateBusinessType
);
businessTypeRouter.get(
    "/api/all/business/type",
    businessTypeController.getAllBusinessType
);
businessTypeRouter.get(
    "/api/business/type/:_id",
    businessTypeController.getIdBusinessType
);

module.exports = businessTypeRouter;
