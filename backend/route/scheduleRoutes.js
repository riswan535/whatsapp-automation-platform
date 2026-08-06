//-----------------------------------------------------------------IMPORT-------------------------------------------------------------------------------------------------------

const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth");
const { createSchedule, getSchedule, updateSchedule, deleteSchedule } = require("../controllers/scheduleController");

//-----------------------------------------------------------------ROUTES------------------------------------------------------------------------------------------------------

router.post("/", protect,  createSchedule);
router.get("/get", protect, getSchedule);
router.put("/update/:id", protect, updateSchedule);
router.delete("/delete/:id", protect, deleteSchedule);

//-----------------------------------------------------------------EXPORT------------------------------------------------------------------------------------------------------

module.exports = router;