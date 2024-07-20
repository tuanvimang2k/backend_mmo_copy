const express = require("express");
const statusBoothRouter = express.Router();
const statusBoothController = require("../controllers/statusBooth.controller");
const tokenMiddleware = require("../../middlewares/token.middleware");

statusBoothRouter.put(
    "/api/update/status/booth",
    statusBoothController.updateStatusBooth
);

module.exports = statusBoothRouter;
