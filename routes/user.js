const router = require('express').Router();
const authController = require('../controllers/auth');
const userController = require('../controllers/user');

router.get(
  '/profile',
  authController.requireSignIn,
  authController.authMiddleware,
  userController.read
);
module.exports = router;
