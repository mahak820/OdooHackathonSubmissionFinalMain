const expressAsyncHandler = require("express-async-handler");
const Venue = require("../../models/venueSchema");
const mongoose = require('mongoose');


// @desc Add a new venue
// @route POST /api/venues
// @access Private (Owner/Admin)
const createVenue = expressAsyncHandler(async (req, res) => {
    const { name, description, address, sportType, pricePerHour, shortLocation, amenities, photos,operatingHours_openingTime,operatingHours_closingTime } = req.body;

    if (!name || !description || !address || !sportType || !pricePerHour || !shortLocation ||!operatingHours_openingTime) {
        res.status(400);
        throw new Error("Please provide all required details");
    }

    const venue = await Venue.create({
        name,
        description,
        address,
        sportType,
        pricePerHour,
        shortLocation,
        amenities,
        photos,
        isBooked: false, // by default available
        ownerId: req.user._id,
        operatingHours_openingTime,
        operatingHours_closingTime


    });

    res.status(201).json(venue);
});

// @desc Get all venues (Admin sees all, User sees only available)
// @route GET /api/venues
// @access Public (different data for user/admin)
const getVenues = expressAsyncHandler(async (req, res) => {
    let venues;

    if (req.user && req.user.role === "admin") {
        venues = await Venue.find({});
    } else {
        venues = await Venue.find({ isBooked: false });
    }

    res.json(venues);
});

// @desc Get single venue
// @route GET /api/venues/:id
// @access Public
const getVenueById = expressAsyncHandler(async (req, res) => {
    const venue = await Venue.findById(req.params.venueid);

    if (!venue) {
        res.status(404);
        throw new Error("Venue not found");
    }

    res.json(venue);
});

const getVenueByUserId = expressAsyncHandler(async (req, res) => {
    const { userId } = req.params.userId;

    const venues = await Venue.find({ ownerId : userId });

    if (!venues || venues.length === 0) {
        return res.status(404).json({ message: "Venue not found" });
    }

    res.json(venues);
});
// @desc Update venue
// @route PUT /api/venues/:id
// @access Private (Owner/Admin)
const updateVenue = expressAsyncHandler(async (req, res) => {
    const venue = await Venue.findById(req.params.venueid);

    if (!venue) {
        res.status(404);
        throw new Error("Venue not found");
    }
    

    // Only owner or admin can update
    

    Object.assign(venue, req.body);
    const updatedVenue = await venue.save();

    res.json(updatedVenue);
});

// @desc Delete venue
// @route DELETE /api/venues/:id
// @access Private (Owner/Admin)
const deleteVenue = expressAsyncHandler(async (req, res) => {
    const venue = await Venue.findById(req.params.venueid);

    if (!venue) {
        res.status(404);
        throw new Error("Venue not found");
    }

   

    await venue.deleteOne();
    res.json({ message: "Venue removed" });
});

module.exports = {
    createVenue,
    getVenues,
    getVenueById,
    updateVenue,
    deleteVenue , 
    getVenueByUserId
};