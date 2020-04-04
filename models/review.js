const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Review must belong to a tour"]
    },
    review_by: {
      type: String,
      required: [true, "Review must be written by a user"]
    }
  },
  {
    toJSON: {virtuals: true },
    toObject: {virtuals: true }
  }
);

const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;
