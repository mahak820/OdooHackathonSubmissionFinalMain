const expressAsyncHandler = require("express-async-handler");
const User = require("../../models/userSchema");
const Booking = require("../../models//bookingSchema");

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


module.exports = {
    getUsers , 
    getBookings
};