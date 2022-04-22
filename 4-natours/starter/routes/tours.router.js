const express = require('express');
const toursController = require('../controllers/tours.controller');

const router = express.Router();

router.param('id', toursController.checkId);

router
  .route('/')
  .get(toursController.getTours)
  .post(toursController.checkBody, toursController.createTour);
router
  .route('/:id')
  .get(toursController.getTourById)
  .patch(toursController.updateTour)
  .delete(toursController.deleteTour);

module.exports = router;
