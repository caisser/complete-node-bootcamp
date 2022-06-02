const User = require('../models/user.model');
const catchAsync = require('../utils/catchAsync');

exports.singup = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);
  res.status(201).json({
    status: 'success',
    message: 'User created',
    data: { user: newUser },
  });
});
