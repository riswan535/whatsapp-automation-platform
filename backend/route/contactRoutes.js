//---------------------------------------------------------IMPORTS-----------------------------------------------------------------------------------------------

const express = require("express");
const router = express.Router();

const Contacts = require("../controllers/contactController");
const protect = require("../middleware/auth");

//----------------------------------------------------------ROUTES-----------------------------------------------------------------------------------------------

router.post("/addcontact", protect, Contacts.addContact);

router.get("/getContacts", protect, Contacts.getContact);

router.delete("/deleteContact/:id", protect, Contacts.deleteContact);

router.post("/sync", protect, Contacts.syncWhatsappContacts);

router.delete( "/deleteSelected", protect, Contacts.deleteSelectedContacts);
//----------------------------------------------------------EXPORTS----------------------------------------------------------------------------------------------

module.exports = router;
