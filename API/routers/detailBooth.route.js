const express = require("express");
const detailBoothRouter = express.Router();
const detailBoothController = require("../controllers/detailBooth.controller");

detailBoothRouter.post(
    "/api/detail/booth",
    detailBoothController.saveDetailBooth
);
detailBoothRouter.put(
    "/api/update/detail/booth",
    detailBoothController.updateDetailBooth
);
detailBoothRouter.get(
    "/api/detail/booth",
    detailBoothController.getDetailBoothByBooth
);
detailBoothRouter.get(
    "/api/detail/booth/by/id",
    detailBoothController.getDetailBoothByIdDetailBooth
);
detailBoothRouter.delete(
    "/api/delete/detail/booth",
    detailBoothController.deleteDetailBooth
);

module.exports = detailBoothRouter;
