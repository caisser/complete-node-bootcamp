// Users Route Handlers
const User = require('../models/user.model');
const catchAsync = require('../utils/catchAsync');

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
