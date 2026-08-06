//------------------------------------------------------------------IMPORT----------------------------------------------------------------------------------------------------

const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth");
const {campaignSaveMSG, getCampaignMSG, updateCampaignMSG, deleteCampaignMSG} = require("../controllers/campaignController");
const { route } = require("./messageRoutes");

//------------------------------------------------------------------ROUTES---------------------------------------------------------------------------------------------------

router.post("/create", protect, campaignSaveMSG);
router.get("/get", protect, getCampaignMSG);
router.put("/update/:id", protect, updateCampaignMSG);
router.delete("/delete/:id", protect, deleteCampaignMSG);

//------------------------------------------------------------------EXPORT----------------------------------------------------------------------------------------------------

module.exports = router;