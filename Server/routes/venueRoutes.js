const express = require("express");
const router = express.Router();
const {
    createVenue,
    getVenues,
    getVenueById,
    updateVenue,
    deleteVenue
} = require("../controllers/venueController");

const { protect, admin } = require("../middleware/authMiddleware");

// Public
router.get("/", protect, getVenues);
router.get("/:id", getVenueById);

// Protected (Owner/Admin)
router.post("/", protect, createVenue);
router.put("/:id", protect, updateVenue);
router.delete("/:id", protect, deleteVenue);

module.exports = router;
