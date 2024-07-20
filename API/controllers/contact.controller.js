const contactModel = require("../../models/contact.model");
const contactController = {
    saveContact: async (req, res) => {
        try {
            const { email, sdt, topic, content } = req.body;
            const newContact = new contactModel({
                email: email,
                sdt: sdt,
                topic: topic,
                content: content,
            });
            const saveContact = await newContact.save();
            return res.status(200).json({
                success: true,
                data: saveContact,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    },
    updateStatusContact: async (req, res) => {
        try {
            const updateStatus = await contactModel.findOneAndUpdate(
                { _id: req.params._id },
                { status: req.body.status },
                { new: true }
            );
            return res.status(200).json({
                success: true,
                data: updateStatus,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    },
    deleteContact: async (req, res) => {
        try {
            await contactModel.findByIdAndDelete(_id);
            return res.status(200).json({
                success: true,
                message: "delete contact successfully",
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    },
    getAllContact: async (req, res) => {
        try {
            const find = await contactModel.find();
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
};
module.exports = contactController;
