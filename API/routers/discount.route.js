const express = require("express");
const discountRouter = express.Router();
const discountController = require("../controllers/discount.controller");

discountRouter.post("/api/create/discount", discountController.createDiscount);
discountRouter.put(
    "/api/update/discount/:_id",
    discountController.updateDiscount
);
discountRouter.delete(
    "/api/delete/discount/:_id",
    discountController.deleteDiscount
);
discountRouter.get("/api/discount/:_id", discountController.getIdDiscount);
discountRouter.get(
    "/api/discount/by/booth/type/:_id",
    discountController.getIdDiscountByIdBoothType
);
discountRouter.get("/api/booth/by/discount", discountController.filterDiscount);

module.exports = discountRouter;
