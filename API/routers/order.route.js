const express = require("express");
const orderRouter = express.Router();
const orderController = require("../controllers/order.controller");

orderRouter.post("/api/create/order", orderController.createOrder);

module.exports = orderRouter;
