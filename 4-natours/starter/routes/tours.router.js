const express = require('express');
const toursController = require('../controllers/tours.controller');

const router = express.Router();

// router.param('id', toursController.checkId);

router
  .route('/top-5-cheap')
  .get(toursController.aliasTopTours, toursController.getTours);

router.route('/tour-stats').get(toursController.getTourStats);
router.route('/monthly-plan/:year').get(toursController.getMonthlyPlan);

router
  .route('/')
  .get(toursController.getTours)
  .post(toursController.createTour); //toursController.checkBody,

router
  .route('/:id')
  .get(toursController.getTourById)
  .patch(toursController.updateTour)
  .delete(toursController.deleteTour);

module.exports = router;
