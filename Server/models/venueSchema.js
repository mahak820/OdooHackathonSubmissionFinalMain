const mongoose = require("mongoose");

const venueSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    },
    location: {
      latitude: { type: Number },
      longitude: { type: Number }
    },
    sportType: {
      type: String,
      required: true
    },
    pricePerHour: {
      type: Number,
      required: true
    },
    operatingHours_openingTime: {
      type : String
    },
     operatingHours_closingTime: {
      type : String
    },
    amenities: {
      type: [String],
      default: []
    },
    photos: {
      type: [String],
      default: []
    },
    isBooked: {
      type: Boolean,
      default: false
    },
    rating: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Venue", venueSchema);