const express = require("express");
const boothTypeRouter = express.Router();
const boothTypeController = require("../controllers/boothType.controller");

boothTypeRouter.post("/api/booth/type", boothTypeController.createBoothType);
boothTypeRouter.put(
    "/api/update/booth/type/:_id",
    boothTypeController.updateBoothType
);
boothTypeRouter.get("/api/all/booth/type", boothTypeController.getAllBoothType);
boothTypeRouter.get("/api/booth/type/:_id", boothTypeController.getIdBoothType);
boothTypeRouter.delete(
    "/api/delete/booth/type/:_id",
    boothTypeController.deleteBoothType
);
boothTypeRouter.get(
    "/api/booth/type/by/business/:_id",
    boothTypeController.getBoothTypeByIdBusiness
);
module.exports = boothTypeRouter;
