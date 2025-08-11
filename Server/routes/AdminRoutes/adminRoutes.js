const express = require("express");
const { getUsers, getBookings } = require("../../controllers/Admin Controllers/adminControllers");
const router = express.Router();



// Public
router.get("/users",  getUsers);
router.get("/bookings",  getBookings);


module.exports = router;