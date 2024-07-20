const express = require("express");
const chatController = require("../controllers/chat.controller");
const chatRouter = express.Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const firebaseMiddleware = require("../../middlewares/firebase.middleware");
const conditionalMiddleware = require("../../middlewares/conditional.middleware");

chatRouter.post(
    "/api/send/chat",
    upload.array("content", 10),
    conditionalMiddleware(firebaseMiddleware.uploadMultipleImages),
    chatController.sendChat
);
chatRouter.get("/api/chat/by/room", chatController.getChatByRoom);

module.exports = chatRouter;
