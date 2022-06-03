const express = require('express');
const usersController = require('../controllers/users.controller');
const authController = require('../controllers/auth.controller');

const router = express.Router();

router.post('/singup', authController.singup);
router.post('/login', authController.login);

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
