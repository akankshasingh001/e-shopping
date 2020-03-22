const express = require('express');

const { handleErrors } = require('./middleware');
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
  handleErrors(signupTemplate),
  async (req, res) => {
    const { email, password } = req.body;
    const user = await usersRepo.create({ email, password });

    req.session.userId = user.id;

    res.redirect('/admin/products');
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
  handleErrors(signinTemplate),
  async (req, res) => {
    const { email } = req.body;
    const user = await usersRepo.getOneBy({ email });
    req.session.userId = user.id;

    res.redirect('/admin/products');
  }
);

module.exports = router;
