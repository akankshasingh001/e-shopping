const { check } = require('express-validator');
const usersRepo = require('../../repositories/users');

module.exports = {
  validateEmail: check('email')
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage('Must be a valid email')
    .custom(async email => {
      const existingUser = await usersRepo.getOneBy({ email });
      if (existingUser) {
        throw new Error('Email already in use.');
      }
    }),
  validatePassword: check('password')
    .trim()
    .isLength({ min: 5, max: 20 })
    .withMessage('Password must be between 5 to 20 characters'),
  validatePasswordConfirmation: check('passwordConfirmation')
    .trim()
    .isLength({ min: 5, max: 20 })
    .withMessage('Password must be between 5 to 20 characters')
    .custom(async (passwordConfirmation, { req }) => {
      if (passwordConfirmation !== req.body.password) {
        throw new Error('Password must match');
      }
    })
};
