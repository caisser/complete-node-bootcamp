const express = require('express');
const morgan = require('morgan');
const AppError = require('./utils/appError');
const errorHandler = require('./controllers/error.controller');
const toursRouter = require('./routes/tours.router');
const usersRouter = require('./routes/users.router');

const app = express();

// Middlewares

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

// Routes

app.use('/api/tours', toursRouter);
app.use('/api/users', usersRouter);

app.all('*', (req, res, next) => {
  // Error custom class
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(errorHandler);

module.exports = app;
