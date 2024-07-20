const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const express = require("express");
const boothRouter = express.Router();
const firebaseMiddleware = require("../../middlewares/firebase.middleware");
const boothController = require("../controllers/booth.controller");
const tokenMiddleware = require("../../middlewares/token.middleware");

boothRouter.post(
    "/api/create/booth",
    tokenMiddleware.authorizeRole(["agent"]),
    upload.array("imageBooth", 10),
    firebaseMiddleware.uploadMultipleImages,
    boothController.createBooth
);
boothRouter.get("/api/booth/user/:_id", boothController.getAllBoothByUser);
boothRouter.get("/api/booth/by/booth", boothController.getBoothByIdBooth);
// boothRouter.get("/api/all/booth/product", boothController.getAllBoothProduct);
// boothRouter.get("/api/all/booth/service", boothController.getAllBoothService);
boothRouter.put(
    "/api/update/booth",
    upload.array("imageBooth", 10),
    firebaseMiddleware.uploadMultipleImages,
    boothController.updateBooth
);
boothRouter.delete("/api/delete/booth", boothController.deleteBooth);
boothRouter.get(
    "/api/filter/discount/booth",
    boothController.paginationDiscount
);
boothRouter.get("/api/search/booth", boothController.searchBooth);
module.exports = boothRouter;
