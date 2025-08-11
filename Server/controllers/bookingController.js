const expressAsyncHandler = require("express-async-handler");
const Booking = require("../models/bookingSchema");
const Venue = require("../models/venueSchema")

// update boking
const updateBooking = expressAsyncHandler(async (req, res) => {
  const bookingId = req.params.bookingId;
  const userId = req.user._id;
  const { date, startTime, endTime, totalPrice } = req.body;

  // Find the booking
  const booking = await Booking.findById(bookingId);
  if (!booking) {
    res.status(404);
    throw new Error("Booking not found");
  }

  // Check if the booking belongs to the logged-in user
  if (booking.userId.toString() !== userId.toString()) {
    res.status(403);
    throw new Error("You can only update your own bookings");
  }

  // Check if venue is booked at the new date/time (excluding current booking)
  const existingBooking = await Booking.findOne({
    venueId: booking.venueId,
    date: date ? new Date(date) : booking.date,
    _id: { $ne: bookingId },
    $or: [
      {
        startTime: { $lt: endTime },
        endTime: { $gt: startTime }
      }
    ]
  });

  if (existingBooking) {
    res.status(400);
    throw new Error("Venue already booked for this date and time");
  }

  // Update fields if provided
  if (date) booking.date = new Date(date);
  if (startTime) booking.startTime = startTime;
  if (endTime) booking.endTime = endTime;
  if (totalPrice) booking.totalPrice = totalPrice;

  const updatedBooking = await booking.save();

  res.json(updatedBooking);
});


// Create booking
const createBooking = expressAsyncHandler(async (req, res) => {
  const { date, startTime, endTime, totalPrice } = req.body;
  const venueId = req.params.venueId;
  const userId = req.user._id;

  if (!date || !startTime || !endTime || !totalPrice) {
    res.status(400);
    throw new Error("Please provide date, startTime, endTime, and totalPrice");
  }

  // Check if venue exists
  const venue = await Venue.findById(venueId);
  if (!venue) {
    res.status(404);
    throw new Error("Venue not found");
  }

  // Check if the venue is already booked on the given date and overlapping time
  const existingBooking = await Booking.findOne({
    venueId,
    date: new Date(date),
    $or: [
      {
        startTime: { $lt: endTime },
        endTime: { $gt: startTime }
      }
    ]
  });

  if (existingBooking) {
    res.status(400);
    throw new Error("Venue already booked for this date and time");
  }

  // Create new booking
  const booking = await Booking.create({
    userId,
    venueId,
    date: new Date(date),
    startTime,
    endTime,
    totalPrice,
    paymentStatus: "pending" // default status
  });

  res.status(201).json(booking);
});

// Get bookings of logged in user
const getMyBookings = expressAsyncHandler(async (req, res) => {
  const bookings = await Booking.find({ userId: req.user._id }).populate("venueId");
  res.json(bookings);
  console.log(req.user._id)
  console.log("Booking userId:", booking.userId);

});

// Get all bookings (admin)
const getAllBookings = expressAsyncHandler(async (req, res) => {
  const bookings = await Booking.find().populate("venueId","name address").populate("userId", "name email");
  res.json(bookings);
 

});
const deleteBooking = expressAsyncHandler(async (req, res) => {
const bookingId = req.params.id;

  const booking = await Booking.findById(bookingId);

  if (!booking) {
    res.status(404);
    throw new Error("Booking not found");
  }

  // Delete booking directly by id
  await Booking.findByIdAndDelete(bookingId);

  res.status(200).json({ message: "Booking deleted successfully" });
});


module.exports = {
  createBooking,
  getMyBookings,
  getAllBookings,
  updateBooking,deleteBooking
};