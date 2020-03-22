const express = require('express');
const bodyParser = require('body-parser'); // Middleware file imported 3rd party lib
const cookieSession = require('cookie-session');
const authRouter = require('./routes/admin/auth');
const productRouter = require('./routes/admin/products');

const app = express();

//Middleware
app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: true }));

//CookieSession Middleware
app.use(
  cookieSession({
    keys: ['jshjdhj']
  })
);
app.use(authRouter);
app.use(productRouter);
app.listen(3000, () => {
  console.log('Listening');
});
