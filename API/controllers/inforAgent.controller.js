const inforAgentModel = require("../../models/inforAgent.model");
const siteController = require("../controllers/siteUser.controller");

const inforAgentController = {
    saveInforAgent: async (req, res) => {
        try {
            const { facebook, sdt, id_user } = req.body;
            const newInforAgent = await new inforAgentModel({
                facebook: facebook,
                sdt: sdt,
                id_user: id_user,
            }).save();
            const updateRole = await siteController.updateRoleUser(id_user);
            return res.status(200).json({
                success: true,
                data: { newInforAgent, updateRole },
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    },
    updateInforAgent: async (req, res) => {
        try {
            const id_user = req.params._id;
            const { facebook, sdt } = req.body;
            const updateInforAgent = await inforAgentModel.findOneAndUpdate(
                { id_user: id_user },
                { facebook: facebook, sdt: sdt },
                { new: true }
            );
            return res.status(200).json({
                success: true,
                message: "Update information agent successfully.",
                data: updateInforAgent,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    },
    getAllInforAgent: async (req, res) => {
        try {
            const find = await inforAgentModel
                .find()
                .populate({ path: "id_user" });
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
    getInforAgentByUser: async (req, res) => {
        try {
            const find = await inforAgentModel
                .findOne({ id_user: req.params._id })
                .populate({ path: "id_user" });
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
module.exports = inforAgentController;
