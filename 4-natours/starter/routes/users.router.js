const express = require('express');
const usersController = require('../controllers/users.controller');
const authController = require('../controllers/auth.controller');

const router = express.Router();

router.post('/singup', authController.singup);
router.post('/login', authController.login);
router.patch(
  '/updateMyPassword',
  authController.protect,
  authController.updatePassword
);
router.patch('/updateMe', authController.protect, usersController.updateMe);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

router
  .route('/')
  .get(usersController.getUsers)
  .post(usersController.createUser);
router
  .route('/:id')
  .get(usersController.getUserById)
  .patch(usersController.updateUser)
  .delete(usersController.deleteUser);

module.exports = router;
