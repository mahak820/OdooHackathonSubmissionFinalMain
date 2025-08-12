const express = require("express");
const { getUsers, getBookings, getVenues, updateVenueApproval } = require("../../controllers/Admin Controllers/adminControllers");
const { deleteVenue } = require("../../controllers/venueController/venueController");
const router = express.Router();



// Public
router.get("/users",  getUsers);
router.get("/bookings",  getBookings);
router.get("/venues",  getVenues);

router.put("/venues/approve/:id", updateVenueApproval);

// This route handles deleting a venue permanently.
// Example: DELETE /api/admin/venues/delete/60d21b4667d0d8992e610c85
router.delete("/venues/delete/:id",  deleteVenue)

module.exports = router;