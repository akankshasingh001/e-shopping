const express = require('express');
const { check, validationResult } = require('express-validator');

const usersRepo = require('../../repositories/users');
const signupTemplate = require('../../views/admin/auth/signup');
const signinTemplate = require('../../views/admin/auth/signin');

const router = express.Router();

//Route Handler
router.get('/signup', (req, res) => {
  res.send(signupTemplate({ req }));
});
//signup
router.post(
  '/signup',
  [
    check('email')
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
    check('password')
      .trim()
      .isLength({ min: 5, max: 20 })
      .withMessage('Password must be between 5 to 20 characters'),
    check('passwordConfirmation')
      .trim()
      .isLength({ min: 5, max: 20 })
      .withMessage('Password must be between 5 to 20 characters')
      .custom(async (passwordConfirmation, { req }) => {
        if (passwordConfirmation !== req.body.password) {
          throw new Error('Password must match');
        }
      })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    console.log(errors);
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
