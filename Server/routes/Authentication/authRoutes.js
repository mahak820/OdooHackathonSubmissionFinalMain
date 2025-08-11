const express = require("express")
const { registerUser,loginUser } = require("../../controllers/Authentication/authController")
// const { registerUser } = require("../Controllers/authController")
const router = express.Router()

router.post("/register" , registerUser )
router.post("/login", loginUser);

module.exports = router