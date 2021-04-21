const { check } = require('express-validator');

exports.userSignupValidation = [
  check('name').not().isEmpty().withMessage('Name is required'),
  check('email').isEmail().withMessage('Must be a valid email address'),
  check('password')
    .isLength({ min: 6 })
    .withMessage('Password must be least 6 charcters long'),
];

exports.userSigninValidation = [
  check('email').isEmail().withMessage('Must be a valid email address'),
  check('password')
    .isLength({ min: 6 })
    .withMessage('Password must be least 6 charcters long'),
];
