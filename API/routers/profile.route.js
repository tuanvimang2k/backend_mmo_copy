const express = require("express");
const profileRouter = express.Router();
const profileController = require("../controllers/profile.controller");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const firebaseMiddleware = require("../../middlewares/firebase.middleware");
const tokenMiddleware = require("../../middlewares/token.middleware");
profileRouter.post(
    "/api/save/profile",
    // tokenMiddleware.authorizeRole(["user", "agent"]),
    upload.array("imageProfile", 10),
    firebaseMiddleware.uploadMultipleImages,
    profileController.saveProfile
);
profileRouter.get(
    "/api/all/profile",
    tokenMiddleware.authorizeRole(["admin"]),
    profileController.getAllProfile
);
profileRouter.get(
    "/api/profile/:_id",
    tokenMiddleware.authorizeRole(["user", "agent", "admin"]),
    profileController.getIdProfile
);
profileRouter.put(
    "/api/update/profile/:_id",
    upload.array("imageProfile", 10),
    firebaseMiddleware.uploadMultipleImages,
    profileController.updateProfile
);
profileRouter.get(
    "/api/detail/profile/:_id",
    profileController.getDetailProfile
);

module.exports = profileRouter;
