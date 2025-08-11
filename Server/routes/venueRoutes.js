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
router.get("/",  getVenues);
router.get("/:venueid", getVenueById);

// Protected (Owner/Admin)
router.post("/",protect, ownerOnly, createVenue);
router.put("/:venueid", protect,ownerOnly, updateVenue);
router.delete("/:venueid",protect, ownerOnly, deleteVenue);

module.exports = router;