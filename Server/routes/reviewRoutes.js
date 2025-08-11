const express = require("express");
const router = express.Router();
const {
  createReview,
  getReviewsByVenue,
  deleteReview,
  updateReview,
} = require("../controllers/reviewControllers");
const { protect, adminOnly } = require("../middlewares/authMiddleWare");

// Create a review (user must be logged in)
router.post("/:venueId", protect, createReview);

// Get all reviews for a venue
router.get("/venue/:venueId", getReviewsByVenue);

// Delete review by ID (only owner or admin)
router.delete("/:id", deleteReview);

// Update review by reviewId (protected route)
router.put('/:reviewId', protect, updateReview);

module.exports = router;