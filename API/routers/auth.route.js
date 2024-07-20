const express = require("express");
const authRouter = express.Router();
const authController = require("../controllers/auth.controller");

authRouter.post("/api/new/accessToken", authController.requestRefreshToken);

module.exports = authRouter;
