// Users Route Handlers
const User = require('../models/user.model');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const filterObj = (obj, ...AllowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((key) => {
    if (AllowedFields.includes(key)) {
      newObj[key] = obj[key];
    }
  });
  return newObj;
};

exports.getUsers = catchAsync(async (req, res) => {
  const users = await User.find();

  // Send response
  res.status(200).json({
    status: 'success',
    message: 'Users retrieved',
    results: users.length,
    data: { users },
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updatePassword',
        400
      )
    );
  }
  // 2) Update user document
  const filteredBody = filterObj(req.body, 'name', 'email');
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    message: 'User updated',
    data: { user: updatedUser },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false }, { new: true });

  res.status(200).json({
    status: 'success',
    message: 'User deactivated',
  });
});

exports.getUserById = (req, res) => {
  res.status(500).json({
    message: 'Fail',
  });
};
exports.createUser = (req, res) => {
  res.status(500).json({
    message: 'Fail',
  });
};
exports.updateUser = (req, res) => {
  res.status(500).json({
    message: 'Fail',
  });
};
exports.deleteUser = (req, res) => {
  res.status(500).json({
    message: 'Fail',
  });
};
