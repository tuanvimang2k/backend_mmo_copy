const express = require("express");
const bankingApiRouter = express.Router();
const bankingController = require("../controllers/banking.controller");

bankingApiRouter.get("/api/vtb/banking", bankingController.transactionApiVtb);
bankingApiRouter.get("/api/acb/banking", bankingController.transactionApiAcb);

module.exports = bankingApiRouter;
