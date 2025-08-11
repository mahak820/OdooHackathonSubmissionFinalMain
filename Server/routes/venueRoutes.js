const express = require("express");
const router = express.Router();
const {
    createVenue,
    getVenues,
    getVenueById,
    updateVenue,
    deleteVenue,
    getVenueByUserId
} = require("../controllers/venueController/venueController");

const { protect, admin, ownerOnly } = require("../middlewares/authMiddleWare");

// Public
router.get("/",  getVenues);
router.get("/:venueid", getVenueById);
//New
router.get("/owner/:userId", protect , ownerOnly,  getVenueByUserId);

// Protected (Owner/Admin)
router.post("/",protect, ownerOnly, createVenue);
router.put("/:venueid", protect,ownerOnly, updateVenue);
router.delete("/:venueid",protect, ownerOnly, deleteVenue);

module.exports = router;