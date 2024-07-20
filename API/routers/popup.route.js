const express = require("express");
const popupRouter = express.Router();
const popupController = require("../controllers/popup.controller");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const firebaseMiddleware = require("../../middlewares/firebase.middleware");

popupRouter.post(
    "/api/new/popup",
    upload.array("image", 10),
    firebaseMiddleware.uploadMultipleImages,
    popupController.createPopup
);
popupRouter.put(
    "/api/update/popup/:_id",
    upload.array("image", 10),
    firebaseMiddleware.uploadMultipleImages,
    popupController.updatePopup
);
popupRouter.delete("/api/delete/popup/:_id", popupController.deletePopup);
popupRouter.get("/api/all/popup", popupController.allPopup);
popupRouter.get("/api/popup/:_id", popupController.popupById);

module.exports = popupRouter;
