//--------------------------------------------------------------IMPORTS---------------------------------------------------------------------------------------

const express = require("express");
const router = express.Router();

const { getUsers, approveUser, deleteUser, adminDashBoard } = require("../controllers/adminController");

const protect = require("../middleware/auth");
const admin = require("../middleware/admin");

//--------------------------------------------------------------ROUTES-----------------------------------------------------------------------------------------

router.get("/getuser", protect, admin, getUsers);

router.put("/approveuser/:id", protect, admin, approveUser);

router.delete("/deleteuser/:id", protect, admin, deleteUser);

router.get("/admindash", protect, admin, adminDashBoard);

//--------------------------------------------------------------EXPORTS-------------------------------------------------------------------------------------------

module.exports = router;

