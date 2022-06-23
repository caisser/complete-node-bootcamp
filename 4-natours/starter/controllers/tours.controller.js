const Tour = require('../models/tour.model');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
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
exports.getTours = catchAsync(async (req, res, next) => {
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
});

exports.getTourById = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const tour = await Tour.findById(id).populate('reviews');

  if (!tour) return next(new AppError(`No tour found with Id ${id}`, 404));

  res.status(200).json({
    status: 'success',
    message: 'Tour retrieved',
    data: { tour },
  });
});

exports.createTour = catchAsync(async (req, res, next) => {
  const newTour = await Tour.create(req.body);
  res.status(201).json({
    status: 'success',
    message: 'Tour created',
    data: { tour: newTour },
  });
});

exports.updateTour = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const tour = await Tour.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!tour) return next(new AppError(`No tour found with Id ${id}`, 404));

  res.status(200).json({
    status: 'success',
    message: 'Tour updated',
    data: { tour },
  });
});

exports.deleteTour = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const tour = await Tour.findByIdAndDelete(id);

  if (!tour) return next(new AppError(`No tour found with Id ${id}`, 404));

  res.status(200).json({
    status: 'success',
    message: 'Tour deleted',
  });
});

// Aggregations pipelines
exports.getTourStats = catchAsync(async (req, res, next) => {
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
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
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
});

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
