const express = require('express');
const bookingsController = require('../controllers/bookings.controller');
const authController = require('../controllers/auth.controller');

const router = express.Router();

router.get(
  '/checkout-session/:tourId',
  authController.protect,
  bookingsController.getCheckoutSession
);

module.exports = router;
