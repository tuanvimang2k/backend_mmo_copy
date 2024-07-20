const express = require("express");
const boothServiceRouter = express.Router();
const boothServiceController = require("../controllers/boothService.controller");

boothServiceRouter.get(
    "/api/all/booth/service",
    boothServiceController.getAllBoothService
);
boothServiceRouter.put(
    "/api/booth/service/status/approved/:_id",
    boothServiceController.updateStatusApproved
);
boothServiceRouter.put(
    "/api/booth/service/status/cancel/:_id",
    boothServiceController.updateStatusCancel
);
boothServiceRouter.get(
    "/api/filter/id/boothType/service",
    boothServiceController.paginationIdBoothTypeService
);
module.exports = boothServiceRouter;
