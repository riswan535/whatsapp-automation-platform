//------------------------------------------------------------------IMPORTS--------------------------------------------------------------------------------------------------------

const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth");
const {getChat, sentMessage} = require("../controllers/messageController");

//------------------------------------------------------------------ROUTES------------------------------------------------------------------------------------------------------

router.get("/getchat/:contactId", protect, getChat);
router.post("/sent", protect, sentMessage);

//------------------------------------------------------------------Exports--------------------------------------------------------------------------------------------------------

module.exports = router;