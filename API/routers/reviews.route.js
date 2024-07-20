const express = require("express");
const reviewsRouter = express.Router();
const reviewsController = require("../controllers/reviews.controller");

reviewsRouter.post("/api/save/reviews", reviewsController.saveReviews);
reviewsRouter.put("/api/update/reviews/:_id", reviewsController.updateReviews);
reviewsRouter.delete(
    "/api/delete/reviews/:_id",
    reviewsController.deleteReviews
);
reviewsRouter.get(
    "/api/reviews/by/booth",
    reviewsController.getReviewsByIdBooth
);
reviewsRouter.get(
    "/api/reviews/by/reviews",
    reviewsController.getReviewByReview
);

module.exports = reviewsRouter;
