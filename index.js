const express = require('express');
const bodyParser = require('body-parser'); // Middleware file imported 3rd party lib
const usersRepo = require('./repositories/users');
const app = express();
//Middleware
app.use(bodyParser.urlencoded({ extended: true }));

//Route Handler
app.get('/', (req, res) => {
  res.send(`<div>
  <form method="POST">
  <input name="email" placeholder="email"/>
  <input name="password" placeholder="password"/>
  <input name="passwordConfirmation" placeholder="password confirmation"/>
  <button>Sign Up</button>
  </form>
  </div>`);
});

app.post('/', async (req, res) => {
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
  res.send('Account Created');
});

app.listen(3000, () => {
  console.log('Listening');
});
