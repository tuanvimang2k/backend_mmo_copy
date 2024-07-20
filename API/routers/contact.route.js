const express = require("express");
const contactController = require("../controllers/contact.controller");
const contactRouter = express.Router();

contactRouter.post("/api/save/contact", contactController.saveContact);
contactRouter.put(
    "/api/update/contact/:_id",
    contactController.updateStatusContact
);
contactRouter.delete("/api/delete/contact", contactController.deleteContact);
contactRouter.get("/api/all/contact", contactController.getAllContact);

module.exports = contactRouter;
