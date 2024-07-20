const express = require("express");
const boothProductRouter = express.Router();
const boothProductController = require("../controllers/boothProduct.controller");

boothProductRouter.get(
    "/api/all/booth/product",
    boothProductController.getAllBoothProduct
);
boothProductRouter.put(
    "/api/booth/product/status/approved/:_id",
    boothProductController.updateStatusApproved
);
boothProductRouter.put(
    "/api/booth/product/status/cancel/:_id",
    boothProductController.updateStatusCancel
);
boothProductRouter.get(
    "/api/filter/id/boothType/product",
    boothProductController.paginationIdBoothType
);
module.exports = boothProductRouter;
