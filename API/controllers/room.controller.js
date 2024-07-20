const roomModel = require("../../models/room.model");
const chatModel = require("../../models/chat.model");
const userModel = require("../../models/user.model");

const roomController = {
    createChat: async (req, res) => {
        try {
            const [firstId, secondId] = req.body.members;
            console.log(firstId, secondId);
            const findRoom = await roomModel.findOne({
                members: { $all: [firstId, secondId] },
            });
            if (findRoom) {
                return res.status(200).json({
                    success: true,
                    data: findRoom,
                });
            }
            const newRoom = await new roomModel({
                members: [firstId, secondId],
            }).save();
            // const chat = await new chatModel({
            //     roomId: newRoom._id,
            // }).save();
            return res.status(200).json({
                success: true,
                data: newRoom,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    },
    allChat: async (req, res) => {
        try {
            const allChat = await roomModel
                .find()
                .populate({ path: "members" });
            return res.status(200).json({
                success: true,
                data: allChat,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    },
    findUserRoom: async (req, res) => {
        try {
            const search = req.query.search;
            const findUser = await userModel.find({
                username: { $regex: ".*" + search + ".*", $options: "i" },
            });
            if (findUser.length > 0) {
                return res.status(200).json({
                    success: true,
                    data: findUser,
                });
            } else {
                return res.status(404).json({
                    success: false,
                    message: "Username not found!",
                });
            }
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    },
    getRoomByIdUser: async (req, res) => {
        try {
            const memberId = req.query.memberId;
            // console.log(memberId);
            const find = await roomModel
                .find({
                    members: { $in: [memberId] },
                })
                .populate({ path: "members" });
            // .sort({ createdAt: -1 });

            // console.log("find:", find);
            if (find.length > 0) {
                return res.status(200).json({
                    success: true,
                    data: find,
                });
            } else {
                return res.status(404).json({
                    success: false,
                    message: "No rooms found with id user!",
                });
            }
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    },
};
module.exports = roomController;
