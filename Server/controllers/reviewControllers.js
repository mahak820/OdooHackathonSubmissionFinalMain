const expressAsyncHandler = require("express-async-handler");
const Review = require("../models/reviewSchema");

// Create a review
const createReview = expressAsyncHandler(async (req, res) => {
    const venueId = req.params.venueId;
  const {  rating, comment } = req.body;

  if (!venueId || !rating || !comment) {
    res.status(400);
    throw new Error("Please provide venueId, rating and comment");
  }

  // Check if user already reviewed this venue (optional)
  const alreadyReviewed = await Review.findOne({
    userId: req.user._id,
    venueId: venueId,
  });
  if (alreadyReviewed) {
    res.status(400);
    throw new Error("You have already reviewed this venue");
  }

  const review = await Review.create({
    userId: req.user._id,
    venueId,
    rating,
    comment,
  });

  res.status(201).json(review);
});

// Get all reviews for a venue
const getReviewsByVenue = expressAsyncHandler(async (req, res) => {
  const venueId = req.params.venueId;

  const reviews = await Review.find({ venueId }).populate("userId", "name email");

  res.json(reviews);
});

// Delete a review by id (only owner or admin can delete)
const deleteReview = expressAsyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  console.log(review);
  if (!review) {
    res.status(404);
    throw new Error("Review not found");
  }

 

  await review.deleteOne();

  res.json({ message: "Review deleted successfully" });
});

const updateReview = expressAsyncHandler(async (req, res) => {
  const reviewId = req.params.reviewId;
  const { rating, comment } = req.body;

  // Find review by id
  const review = await Review.findById(reviewId);

  if (!review) {
    res.status(404);
    throw new Error("Review not found");
  }

  // Check if the logged-in user is the owner of the review
  if (review.userId.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("You can only update your own review");
  }

  // Update fields
  if (rating) review.rating = rating;
  if (comment) review.comment = comment;

  const updatedReview = await review.save();

  res.json(updatedReview);
});


module.exports = {
  createReview,
  getReviewsByVenue,
  deleteReview,updateReview
};