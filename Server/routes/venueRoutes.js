const express = require("express");
const router = express.Router();
const {
    createVenue,
    getVenues,
    getVenueById,
    updateVenue,
    deleteVenue
} = require("../controllers/venueController/venueController");

const { protect, admin, ownerOnly } = require("../middlewares/authMiddleWare");

// Public
router.get("/", protect, getVenues);
router.get("/:id", getVenueById);

// Protected (Owner/Admin)
router.post("/",protect, ownerOnly, createVenue);
router.put("/:id", protect,ownerOnly, updateVenue);
router.delete("/:id",protect, ownerOnly, deleteVenue);

module.exports = router;