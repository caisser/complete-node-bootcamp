const Review = require('../models/review.model');
const catchAsync = require('../utils/catchAsync');

exports.getReviews = catchAsync(async (req, res, next) => {
  const reviews = await Review.find();

  // Send response
  res.status(200).json({
    status: 'success',
    message: 'Reviews retrieved',
    results: reviews.length,
    data: { reviews },
  });
});

exports.createReview = catchAsync(async (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  const review = req.body;
  const newReview = await Review.create(review);

  // Send response
  res.status(201).json({
    status: 'success',
    message: 'Review created',
    data: { newReview },
  });
});
