const express = require("express")
const { registerUser } = require("../../controllers/Authentication/authController")
// const { registerUser } = require("../Controllers/authController")
const router = express.Router()

router.post("/" , registerUser )

module.exports = router