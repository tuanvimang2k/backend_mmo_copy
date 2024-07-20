const express = require("express");
const sendEmailRouter = express.Router();
const sendEmailController = require("../controllers/sendMail.controller");

sendEmailRouter.get("/api/:_id/verify/:token", sendEmailController.verifyEmail);
sendEmailRouter.post("/api/back/token", sendEmailController.sendBackToken);

module.exports = sendEmailRouter;
