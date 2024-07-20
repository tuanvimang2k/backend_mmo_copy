const favoriteModel = require("../../models/favorite.model");
const favoriteController = {
    postFavorite: async (req, res) => {
        try {
            const { id_user, id_booth, id_business } = req.body;
            if (id_business === process.env.ID_BUSINESS_PRODUCT) {
                const newFavorite = new favoriteModel({
                    id_user: id_user,
                    id_boothProduct: id_booth,
                    id_boothService: null,
                });
                const saveFavorite = await newFavorite.save();
                return res.status(200).json({
                    success: true,
                    data: saveFavorite,
                });
            } else {
                const newFavorite = new favoriteModel({
                    id_user: id_user,
                    id_boothService: id_booth,
                    id_boothProduct: null,
                });
                const saveFavorite = await newFavorite.save();
                return res.status(200).json({
                    success: true,
                    data: saveFavorite,
                });
            }
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    },
    allFavoriteByUser: async (req, res) => {
        try {
            //console.log(456);
            const findAllFavoriteByUser = await favoriteModel
                .find({
                    id_user: req.params._id,
                })
                .populate({
                    path: "id_boothProduct",
                    populate: [
                        {
                            path: "detailBooth",
                        },
                        { path: "id_user" },
                    ],
                })
                .populate({
                    path: "id_boothService",
                    populate: [
                        {
                            path: "detailBooth",
                        },
                        { path: "id_user" },
                    ],
                })
                .populate({ path: "id_user" });
            return res.status(200).json({
                success: true,
                data: findAllFavoriteByUser,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    },
    deleteFavorite: async (req, res) => {
        try {
            const { id_user, id_booth, id_business } = req.body;
            if (id_business === process.env.ID_BUSINESS_PRODUCT) {
                await favoriteModel.findOneAndDelete({
                    id_user: id_user,
                    id_boothProduct: id_booth,
                });
            } else {
                await favoriteModel.findOneAndDelete({
                    id_user: id_user,
                    id_boothService: id_booth,
                });
            }
            return res.status(200).json({
                success: true,
                message: "Favorite deleted successfully!",
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    },
    allFavorite: async (req, res) => {
        try {
            const findAllFavorite = await favoriteModel
                .find()
                .populate({ path: "id_boothProduct" })
                .populate({ path: "id_boothService" });
            return res.status(200).json({
                success: true,
                data: findAllFavorite,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    },
};
module.exports = favoriteController;
