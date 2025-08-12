const expressAsyncHandler = require("express-async-handler");
const User = require("../../models/userSchema");
const Booking = require("../../models//bookingSchema");
const Venue = require("../../models/venueSchema");

const mongoose = require('mongoose');




const getUsers = expressAsyncHandler(async (req, res) => {
    const users = await User.find({ role: { $ne: "admin" } }).select("-password"); // admin ko exclude kiya
        if (!users || users.length === 0) {
            res.status(404);
            throw new Error("No users found");
        }

    res.status(200).json(users);
});

const getBookings = expressAsyncHandler(async (req, res) => {
    const bookings = await Booking.find() // admin ko exclude kiya
        if (!bookings || bookings.length === 0) {
            res.status(404);
            throw new Error("No users found");
        }

    res.status(200).json(bookings);
});

const getVenues = expressAsyncHandler(async (req, res) => {
    const venues = await Venue.find() // admin ko exclude kiya
        if (!venues || venues.length === 0) {
            res.status(404);
            throw new Error("No venues found");
        }

    res.status(200).json(venues);
});

const updateVenueApproval = expressAsyncHandler(async (req, res) => {
  // This function is called when the admin clicks "Yes, Approve".
  // The frontend should send { "isApproved": true } in the request body.
  const { isApproved } = req.body;

  if (typeof isApproved !== 'boolean') {
    res.status(400);
    throw new Error('Invalid approval status provided.');
  }

  const venue = await Venue.findById(req.params.id);

  if (venue) {
    venue.isApproved = isApproved;
    const updatedVenue = await venue.save();

    res.status(200).json({
      _id: updatedVenue._id,
      name: updatedVenue.name,
      isApproved: updatedVenue.isApproved,
      message: `Venue has been successfully approved.`
    });
  } else {
    res.status(404);
    throw new Error('Venue not found');
  }
});

/**
 * @desc    Delete a venue (Admin only)
 * @route   DELETE /api/venues/:id
 * @access  Private/Admin
 */
const deleteVenue = expressAsyncHandler(async (req, res) => {
  // This function is called when the admin clicks "Yes, Delete".
  const venue = await Venue.findById(req.params.id);

  if (venue) {
    await venue.deleteOne(); // Mongoose v6+ uses deleteOne()
    res.status(200).json({ message: 'Venue removed successfully' });
  } else {
    res.status(404);
    throw new Error('Venue not found');
  }
});


module.exports = {
    getUsers , 
    getBookings ,
    getVenues , 
    deleteVenue , 
    updateVenueApproval
};