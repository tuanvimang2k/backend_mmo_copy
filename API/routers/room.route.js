const express = require("express");
const roomRouter = express.Router();
const roomController = require("../controllers/room.controller");

roomRouter.post("/api/create/room", roomController.createChat);
roomRouter.get("/api/search/chat", roomController.findUserRoom);
roomRouter.get("/api/all/room", roomController.allChat);
roomRouter.get("/api/get/room/by/user", roomController.getRoomByIdUser);

module.exports = roomRouter;
