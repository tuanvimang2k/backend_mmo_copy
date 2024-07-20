const express = require("express");
const favoriteRouter = express.Router();
const favoriteController = require("../controllers/favorite.controller");

favoriteRouter.post("/api/post/favorite", favoriteController.postFavorite);
favoriteRouter.get(
    "/api/favorite/by/user/:_id",
    favoriteController.allFavoriteByUser
);
favoriteRouter.delete(
    "/api/delete/favorite",
    favoriteController.deleteFavorite
);
favoriteRouter.get("/api/all/favorite", favoriteController.allFavorite);
module.exports = favoriteRouter;
