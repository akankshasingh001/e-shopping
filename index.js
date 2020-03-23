const express = require('express');
const bodyParser = require('body-parser'); // Middleware file imported 3rd party lib
const cookieSession = require('cookie-session');
const authRouter = require('./routes/admin/auth');
const adminProductRouter = require('./routes/admin/products');
const productsRouter = require('./routes/products');
const cartsRouter = require('./routes/carts');

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
app.use(adminProductRouter);
app.use(productsRouter);
app.use(cartsRouter);

app.listen(3000, () => {
  console.log('Listening');
});
