const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      maxlength: [200, 'A review must have less or equal than 200 characters'],
      minlength: [20, 'A review must have more or equal than 20 characters'],
      required: [true, 'Review can not be empty'],
    },
    rating: {
      type: Number,
      default: 0,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour.'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user.'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Middleware
reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user tour',
    select: '-__v -passwordChangedAt',
  });
  next();
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
