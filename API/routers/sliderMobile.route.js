const express = require("express");
const sliderMobileRouter = express.Router();
const sliderMobileController = require("../controllers/sliderMobile.controller");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const firebaseMiddleware = require("../../middlewares/firebase.middleware");
const tokenMiddleware = require("../../middlewares/token.middleware");

sliderMobileRouter.post(
    "/api/save/slider",
    upload.array("image", 10),
    firebaseMiddleware.uploadMultipleImages,
    sliderMobileController.saveSliderMobile
);
sliderMobileRouter.put(
    "/api/update/slider/:_id",
    upload.array("image", 10),
    firebaseMiddleware.uploadMultipleImages,
    sliderMobileController.updateSliderMobile
);
sliderMobileRouter.delete(
    "/api/delete/slider/:_id",
    sliderMobileController.deleteSlider
);
sliderMobileRouter.get(
    "/api/all/slider",
    sliderMobileController.getAllSliderMobile
);
sliderMobileRouter.get(
    "/api/slider/:_id",
    sliderMobileController.getIdSliderMobile
);
module.exports = sliderMobileRouter;
