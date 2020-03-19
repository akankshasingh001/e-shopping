const express = require('express');
const bodyParser = require('body-parser'); // Middleware file imported 3rd party lib
const cookieSession = require('cookie-session');
const authRouter = require('./routes/admin/auth');

const app = express();
//Middleware
app.use(bodyParser.urlencoded({ extended: true }));

//CookieSession Middleware
app.use(
  cookieSession({
    keys: ['jshjdhj']
  })
);
app.use(authRouter);
app.listen(3000, () => {
  console.log('Listening');
});
