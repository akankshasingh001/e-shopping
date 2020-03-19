const express = require('express');
const bodyParser = require('body-parser'); // Middleware file imported 3rd party lib
const cookieSession = require('cookie-session');
const usersRepo = require('./repositories/users');

const app = express();
//Middleware
app.use(bodyParser.urlencoded({ extended: true }));

//CookieSession Middleware
app.use(
  cookieSession({
    keys: ['jshjdhj']
  })
);
//Route Handler
app.get('/signup', (req, res) => {
  res.send(`<div>
  Your id is : ${req.session.userId}
  <form method="POST">
  <input name="email" placeholder="email"/>
  <input name="password" placeholder="password"/>
  <input name="passwordConfirmation" placeholder="password confirmation"/>
  <button>Sign Up</button>
  </form>
  </div>`);
});

app.post('/signup', async (req, res) => {
  const { email, password, passwordConfirmation } = req.body;
  const existingUser = await usersRepo.getOneBy({ email });
  if (existingUser) {
    return res.send('Email already in use.');
  }
  if (password !== passwordConfirmation) {
    return res.send('Password must match');
  }
  //Create a user in our user repo to represent this person
  const user = await usersRepo.create({ email, password });
  //Store the id of that user inside the users cookie
  req.session.userId = user.id; //here userId can be any name. It is coming by session.

  res.send('Account Created');
});

//signOut
app.get('/signout', (req, res) => {
  req.session = null;
  res.send('You are logged out!');
});

//signIn
app.get('/signin', (req, res) => {
  res.send(`<div>
  <form method="POST">
  <input name="email" placeholder="email"/>
  <input name="password" placeholder="password"/>
  <button>Sign In</button>
  </form>
  </div>`);
});
app.post('/signin', async (req, res) => {
  const { email, password } = req.body;
  const user = await usersRepo.getOneBy({ email });
  if (!user) {
    return res.send('Email not found!');
  }
  if (user.password !== password) {
    return res.send('Password incorrect!');
  }
  req.session.userId = user.id;
  res.send('You are signed in!!!');
});
app.listen(3000, () => {
  console.log('Listening');
});
