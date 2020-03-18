const express = require('express');

const app = express();

//Route Handler
app.get('/', (req, res) => {
  res.send('Hi there');
});

app.listen(3000, () => {
  console.log('Listening');
});
