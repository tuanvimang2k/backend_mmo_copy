const express = require("express");
const refSystemRouter = express.Router();
const refSystemController = require("../controllers/refSystem.controller");

refSystemRouter.post(
    "/api/create/ref/system",
    refSystemController.postRefSystem
);
refSystemRouter.get("/api/ref/system/:_id", refSystemController.getIdRefSystem);
refSystemRouter.get("/api/ref/system", refSystemController.getAllRefSystem);
refSystemRouter.put(
    "/api/update/ref/system/:_id",
    refSystemController.updateRefSystem
);
refSystemRouter.delete(
    "/api/delete/ref/system/:_id",
    refSystemController.deleteRefSystem
);

module.exports = refSystemRouter;
