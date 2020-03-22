const { check } = require('express-validator');
const usersRepo = require('../../repositories/users');

module.exports = {
  validateTitle: check('title')
    .trim()
    .isLength({ min: 4, max: 40 })
    .withMessage('Must be between 4 and 40 characters'),
  validatePrice: check('price')
    .trim()
    .toFloat()
    .isFloat({ min: 1 })
    .withMessage('Must be number greater than 1'),
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
    }),
  validEmailExist: check('email')
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage('Must provide a valid email')
    .custom(async email => {
      const user = await usersRepo.getOneBy({ email });
      if (!user) {
        throw new Error('Email not found!');
      }
    }),
  validPasswordExist: check('password')
    .trim()
    .custom(async (password, { req }) => {
      const user = await usersRepo.getOneBy({ email: req.body.email });
      if (!user) {
        throw new Error('Invalid Password');
      }
      const validPassword = await usersRepo.comparePasswords(
        user.password,
        password
      );
      if (!validPassword) {
        throw new Error('Invalid password');
      }
    })
};
