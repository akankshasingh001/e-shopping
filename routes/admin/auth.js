const express = require('express');
const { validationResult } = require('express-validator');

const usersRepo = require('../../repositories/users');
const signupTemplate = require('../../views/admin/auth/signup');
const signinTemplate = require('../../views/admin/auth/signin');
const {
  validateEmail,
  validatePassword,
  validatePasswordConfirmation
} = require('./validators');

const router = express.Router();

//Route Handler
router.get('/signup', (req, res) => {
  res.send(signupTemplate({ req }));
});
//signup
router.post(
  '/signup',
  [validateEmail, validatePassword, validatePasswordConfirmation],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.send(signupTemplate({ req, errors }));
    }
    const { email, password, passwordConfirmation } = req.body;

    //Create a user in our user repo to represent this person
    const user = await usersRepo.create({ email, password });
    //Store the id of that user inside the users cookie
    req.session.userId = user.id; //here userId can be any name. It is coming by session.

    res.send('Account Created');
  }
);

//signOut
router.get('/signout', (req, res) => {
  req.session = null;
  res.send('You are logged out!');
});

//signIn
router.get('/signin', (req, res) => {
  res.send(signinTemplate());
});
router.post('/signin', async (req, res) => {
  const { email, password } = req.body;
  const user = await usersRepo.getOneBy({ email });
  if (!user) {
    return res.send('Email not found!');
  }

  const validPassword = await usersRepo.comparePasswords(
    user.password,
    password
  );

  if (!validPassword) {
    return res.send('Password incorrect!');
  }
  req.session.userId = user.id;
  res.send('You are signed in!!!');
});

module.exports = router;
