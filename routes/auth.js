const router = require('express').Router();
const authController = require('../controllers/auth');

const { runValidation } = require('../validations');
const {
  userSignupValidation,
  userSigninValidation,
} = require('../validations/auth');

router.post(
  '/signup',
  userSignupValidation,
  runValidation,
  authController.signup
);

router.post(
  '/signin',
  userSigninValidation,
  runValidation,
  authController.signin
);

router.get('/signout', authController.signout);
router.get('/secret', authController.requireSignIn, (req, res) => {
  res.json({
    user: req.user,
  });
});

module.exports = router;
