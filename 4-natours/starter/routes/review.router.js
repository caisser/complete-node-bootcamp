const express = require('express');
const reviewController = require('../controllers/reviews.controller');
const authController = require('../controllers/auth.controller');

const router = express.Router({ mergeParams: true });

//POST /tours/123123123/reviews is same as
//POST /reviews
//GET /tours/123123123/reviews is same as
//GET /reviews

router
  .route('/')
  .get(reviewController.getReviews)
  .post(
    authController.protect,
    authController.restrictTo('user'),
    reviewController.setTourUserIds,
    reviewController.createReview
  );

router
  .route('/:id')
  .get(reviewController.getReviewById)
  .patch(reviewController.updateReview)
  .delete(reviewController.deleteReview);

module.exports = router;
