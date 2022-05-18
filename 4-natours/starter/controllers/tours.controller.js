const Tour = require('../models/tour.model');
const APIFeatures = require('../utils/apiFeatures');
/*
const fs = require('fs');
// File DB
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

// Middleware
exports.checkId = (req, res, next, val) => {
  const { id } = req.params;
  const tour = tours.find((tour) => tour.id === +id);
  if (!tour) {
    return res.status(404).json({
      status: 'Error',
      message: `No tour with id: ${id}`,
    });
  }
  next();
};

exports.checkBody = (req, res, next) => {
  const { body } = req;
  if (!body.hasOwnProperty('name') || !body.hasOwnProperty('price')) {
    return res.status(400).json({
      status: 'Error',
      message: 'Please provide name and price',
    });
  }
  next();
};
*/

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

// Tours Route Handlers
exports.getTours = async (req, res) => {
  try {
    // Build and Execute query
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const tours = await features.query;

    // Send response
    res.status(200).json({
      status: 'success',
      message: 'Tours retrieved',
      results: tours.length,
      data: { tours },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error,
    });
  }
};

exports.getTourById = async (req, res) => {
  try {
    const { id } = req.params;
    const tour = await Tour.findById(id);

    res.status(200).json({
      status: 'success',
      message: 'Tour retrieved',
      data: { tour },
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error,
    });
  }
};

exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: 'success',
      message: 'Tour created',
      data: { tour: newTour },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error,
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const { id } = req.params;
    const tour = await Tour.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: 'success',
      message: 'Tour updated',
      data: { tour },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error,
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    const { id } = req.params;
    await Tour.findByIdAndDelete(id);
    res.status(200).json({
      status: 'success',
      message: 'Tour deleted',
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error,
    });
  }
};

// Aggregations pipelines
exports.getTourStats = async (req, res) => {
  try {
    const stats = await Tour.aggregate([
      {
        $match: {
          ratingsAverage: { $gte: 4.5 },
        },
      },
      {
        $group: {
          //_id: null,
          _id: '$difficulty',
          numTours: { $sum: 1 },
          numRatings: { $sum: '$ratingsQuantity' },
          avgRating: { $avg: '$ratingsAverage' },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
        },
      },
      {
        // sort by avgPrice asc
        $sort: { avgPrice: 1 },
      },
    ]);

    res.status(200).json({
      status: 'success',
      message: 'Stats retrieved',
      data: { stats },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error,
    });
  }
};

exports.getMonthlyPlan = async (req, res) => {
  try {
    const year = req.params.year * 1;

    const plan = await Tour.aggregate([
      {
        $unwind: '$startDates',
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { $month: '$startDates' },
          numTours: { $sum: 1 },
          tours: { $push: '$name' },
        },
      },
      {
        $addFields: { month: '$_id' },
      },
      {
        $project: {
          _id: 0,
        },
      },
      {
        $sort: { numTours: -1 },
      },
      {
        $limit: 6,
      },
    ]);

    res.status(200).json({
      status: 'success',
      message: 'Stats retrieved',
      data: { plan },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error,
    });
  }
};

// exports.updateTour = (req, res) => {
//   const { id } = req.params;
//   const { body } = req;

//   const index = tours.findIndex((tour) => tour.id === +id);
//   const tour = tours[index];

//   tours[index] = {
//     ...tour,
//     ...body,
//   };

//   fs.writeFile(
//     `${__dirname}/dev-data/data/tours-simple.json`,
//     JSON.stringify(tours),
//     (err) => {
//       res.status(200).json({
//         status: 'success',
//         message: 'Tour modified',
//         data: { tour: tours[index] },
//       });
//     }
//   );
// };

// exports.deleteTour = (req, res) => {
//   const { id } = req.params;

//   const index = tours.findIndex((tour) => tour.id === +id);
//   tours.splice(index, 1);

//   fs.writeFile(
//     `${__dirname}/dev-data/data/tours-simple.json`,
//     JSON.stringify(tours),
//     (err) => {
//       res.status(202).json({
//         status: 'success',
//         message: 'Tour deleted',
//       });
//     }
//   );
// };
