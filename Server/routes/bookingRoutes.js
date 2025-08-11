const express = require("express");
const router = express.Router();
const {
  createBooking,
  getMyBookings,deleteBooking,
  getAllBookings,updateBooking
} = require("../controllers/bookingController");
const { protect,  adminOnly } = require("../middlewares/authMiddleWare");

// Create booking - only logged in users  
router.post("/:venueId", protect, createBooking);
router.put("/:bookingId", protect, updateBooking);
router.delete("/:id", protect, deleteBooking);



// Get logged in user's bookings
router.get("/mybookings", protect, getMyBookings);

// Get all bookings - only admin
router.get("/", protect, adminOnly, getAllBookings);

module.exports = router;