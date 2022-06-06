const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const signToken = (payload) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRATION,
  });
  return token;
};

exports.singup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  const token = signToken({
    id: newUser._id,
  });

  res.status(201).json({
    status: 'success',
    message: 'User created',
    token,
    data: { user: newUser },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) check if email and password exist
  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }

  // 2) Check if user exist && password is correct
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Please provide valid email and password!', 401));
  }

  // 3) If everything is correct, send token to client
  const token = signToken({
    id: user._id,
  });

  res.status(200).json({
    status: 'success',
    message: 'User logged in',
    token,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  // 1) Get the token and check if exist
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.replace('Bearer ', '');
  }
  if (!token) {
    return next(
      new AppError('Please login before performing this action', 401)
    );
  }
  // 2) Verification of Token
  const { id } = jwt.verify(token, process.env.JWT_SECRET);
  // 3) Check if user still exists
  const user = User.findById(id);

  if (!user) {
    return next(new AppError('Invalid token!!!', 401));
  }

  // 4) Check if user changed password after JWT was issued
  next();
});
