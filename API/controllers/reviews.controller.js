const reviewsModel = require("../../models/reviews.model");

const reviewsController = {
    saveReviews: async (req, res) => {
        try {
            const { id_user, review, id_booth, id_business, stars } = req.body;
            let saveReview;
            if (id_business === process.env.ID_BUSINESS_PRODUCT) {
                saveReview = await new reviewsModel({
                    id_boothProduct: id_booth,
                    id_boothService: null,
                    id_user: id_user,
                    review: review,
                    stars: stars,
                }).save();
            } else {
                saveReview = await new reviewsModel({
                    id_boothProduct: null,
                    id_boothService: id_booth,
                    id_user: id_user,
                    review: review,
                    stars: stars,
                }).save();
            }
            return res.status(200).json({
                success: true,
                data: saveReview,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    },
    updateReviews: async (req, res) => {
        const _id = req.params._id;
        const updateReviews = await reviewsModel.findOneAndUpdate(
            { _id: _id },
            { review: req.body.reviews, stars: req.body.stars },
            { new: true }
        );
        return res.status(200).json({
            success: true,
            data: updateReviews,
        });
    },
    deleteReviews: async (req, res) => {
        try {
            await reviewsModel.findByIdAndDelete(req.params._id);
            return res.status(200).json({
                success: true,
                message: "Delete reviews successfully.",
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    },
    getReviewsByIdBooth: async (req, res) => {
        try {
            const { id_booth, id_businessType } = req.query;
            let find;
            if (id_businessType === process.env.ID_BUSINESS_PRODUCT) {
                find = await reviewsModel
                    .find({ id_boothProduct: id_booth })
                    .populate({ path: "id_user" });
            } else if (id_businessType === process.env.ID_BUSINESS_SERVICE) {
                find = await reviewsModel
                    .find({ id_boothService: id_booth })
                    .populate({ path: "id_user" });
            }
            return res.status(200).json({
                success: true,
                data: find,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    },
    getReviewByReview: async (req, res) => {
        try {
            const findByIdReview = await reviewsModel.findById(req.params._id);
            return res.status(200).json({
                success: true,
                data: findByIdReview,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    },
};
module.exports = reviewsController;
