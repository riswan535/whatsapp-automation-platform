//---------------------------------------------------------IMPORTS-----------------------------------------------------------------------------------------------

const express = require("express");
const router = express.Router();

const { registerUser, loginUser } = require("../controllers/authController");
const protect = require("../middleware/auth");

//----------------------------------------------------------ROUTES-----------------------------------------------------------------------------------------------

router.post("/register", registerUser);

router.post("/login", loginUser);


//-----------------------------------------------------------EXPORTS----------------------------------------------------------------------------------------------

module.exports = router;