const express = require("express");
const userRouter = express.Router();
const siteController = require("../controllers/siteUser.controller");

userRouter.post("/api/signup", siteController.postSignUpUser);
userRouter.post("/api/login", siteController.postLogin);
userRouter.post("/api/login/google", siteController.postLoginGoogle);
userRouter.get("/api/all/user", siteController.getAllUser);
userRouter.get("/api/user/by/:_id", siteController.getIdUser);
userRouter.put("/api/update/status/user/:_id", siteController.updateStatusUser);
userRouter.put("/api/change/password/:_id", siteController.updatePassword);
module.exports = userRouter;
