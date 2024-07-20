const chatModel = require("../../models/chat.model");
const roomModel = require("../../models/room.model");

const chatController = {
    sendChat: async (req, res) => {
        try {
            const { roomId, sender, content } = req.body;
            console.log(req.listImage);
            const findRoom = await roomModel.findOne({
                _id: roomId,
            });
            if (!findRoom) {
                return res.status(404).json({
                    success: false,
                    message: "The room not found!",
                });
            }
            let block = findRoom.totalBlock;
            const count = await chatModel.countDocuments({
                roomId: roomId,
                block: block,
            });
            console.log(count);
            if (count > 10) {
                block++;
                findRoom.totalBlock = block;
                await findRoom.save();
            }
            let contentUrl = content;
            if (req.listImage && req.listImage.length > 0) {
                contentUrl = req.listImage[0];
            }
            const newChat = await new chatModel({
                roomId: roomId,
                senderId: sender,
                content: contentUrl,
                block: block,
            }).save();
            return res.status(200).json({
                success: true,
                data: newChat,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    },
    getChatByRoom: async (req, res) => {
        try {
            const { roomId, block } = req.query;
            const findChat = await chatModel.find({
                roomId: roomId,
                block: block,
            });
            // .sort({
            //     createdAt: -1,
            // });
            return res.status(200).json({
                success: true,
                data: findChat,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    },
    deleteOldChat: async () => {
        const dateNow = new Date();
        dateNow.setDate(dateNow.getDate() - 15);
        try {
            const chat = await chatModel.deleteMany({
                createdAt: { $lt: dateNow },
            });
            console.log("Deleted!");
        } catch (error) {
            console.error("Error deleting old messages:", error);
        }
    },
};
module.exports = chatController;
