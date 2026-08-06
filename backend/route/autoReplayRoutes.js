//---------------------------------------------------------------------IMPORT-----------------------------------------------------------------------------------------------

const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth");
const {creatAautoMesaage, getAutoReply, updateAutoReply ,deleteAutoReply} = require("../controllers/autoReplayController");
const { route } = require("./messageRoutes");
const { get } = require("mongoose");

//---------------------------------------------------------------------ROUTES-----------------------------------------------------------------------------------------------

router.post("/create", protect, creatAautoMesaage);
router.put("/update/:id", protect, updateAutoReply);
router.delete("/delete/:id", protect, deleteAutoReply);
router.get("/get", protect, getAutoReply);

//---------------------------------------------------------------------EXPORT-----------------------------------------------------------------------------------------------

module.exports = router;