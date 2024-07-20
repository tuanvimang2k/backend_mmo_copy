const express = require("express");
const inforAgentRouter = express.Router();
const inforAgentController = require("../controllers/inforAgent.controller");

inforAgentRouter.post(
    "/api/save/infor/agent",
    inforAgentController.saveInforAgent
);
inforAgentRouter.put(
    "/api/update/infor/agent/:_id",
    inforAgentController.updateInforAgent
);
inforAgentRouter.get(
    "/api/all/infor/agent",
    inforAgentController.getAllInforAgent
);
inforAgentRouter.get(
    "/api/infor/agent/by/user/:_id",
    inforAgentController.getInforAgentByUser
);

module.exports = inforAgentRouter;
