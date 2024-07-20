const express = require("express");
const transactionHistoryRouter = express.Router();
const transactionHistoryController = require("../controllers/transactionHistory.controller");

transactionHistoryRouter.get(
    "/api/transaction/by/user/:_id",
    transactionHistoryController.getAllTransactionByUser
);

module.exports = transactionHistoryRouter;
