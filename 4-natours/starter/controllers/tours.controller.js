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

// Tours Route Handlers
exports.getTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Tours retrieved',
    results: tours.length,
    data: { tours },
  });
};

exports.getTourById = (req, res) => {
  const { id } = req.params;
  const tour = tours.find((tour) => tour.id === +id);

  res.status(200).json({
    status: 'success',
    message: 'Tour retrieved',
    data: { tour },
  });
};

exports.createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = {
    id: newId,
    ...req.body,
  };

  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        message: 'Tours created',
        data: { tour: newTour },
      });
    }
  );
};

exports.updateTour = (req, res) => {
  const { id } = req.params;
  const { body } = req;

  const index = tours.findIndex((tour) => tour.id === +id);
  const tour = tours[index];

  tours[index] = {
    ...tour,
    ...body,
  };

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(200).json({
        status: 'success',
        message: 'Tour modified',
        data: { tour: tours[index] },
      });
    }
  );
};

exports.deleteTour = (req, res) => {
  const { id } = req.params;

  const index = tours.findIndex((tour) => tour.id === +id);
  tours.splice(index, 1);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(202).json({
        status: 'success',
        message: 'Tour deleted',
      });
    }
  );
};
