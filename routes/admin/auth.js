const express = require('express');
const { validationResult } = require('express-validator');

const usersRepo = require('../../repositories/users');
const signupTemplate = require('../../views/admin/auth/signup');
const signinTemplate = require('../../views/admin/auth/signin');
const {
  validateEmail,
  validatePassword,
  validatePasswordConfirmation,
  validEmailExist,
  validPasswordExist
} = require('./validators');

const router = express.Router();

//signUp
router.get('/signup', (req, res) => {
  res.send(signupTemplate({ req }));
});

router.post(
  '/signup',
  [validateEmail, validatePassword, validatePasswordConfirmation],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.send(signupTemplate({ req, errors }));
    }

    const { email, password, passwordConfirmation } = req.body;
    const user = await usersRepo.create({ email, password });

    req.session.userId = user.id;

    res.send('Account created!!!');
  }
);
//sign Out
router.get('/signout', (req, res) => {
  req.session = null;
  res.send('You are logged out');
});

//sign In
router.get('/signin', (req, res) => {
  res.send(signinTemplate({}));
});

router.post(
  '/signin',
  [validEmailExist, validPasswordExist],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.send(signinTemplate({ errors }));
    }

    const { email } = req.body;
    const user = await usersRepo.getOneBy({ email });
    req.session.userId = user.id;

    res.send('You are signed in!!!');
  }
);

module.exports = router;
