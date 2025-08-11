const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    venueId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Venue",
      required: true
    },
    date: {
      type: Date, // e.g. 2025-08-15
      required: true
    },
    startTime: {
      type: String, // e.g. "06:00 PM"
      required: true
    },
    endTime: {
      type: String, // e.g. "07:00 PM"
      required: true
    },
    totalPrice: {
      type: Number,
      required: true
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending"
    },isBooked : {
      type : Boolean,
      default: false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);