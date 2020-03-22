const express = require('express');
const productRepo = require('../../repositories/products');

const router = express.Router();

router.get('/admin/products', (req, res) => {
  res.send('Product page');
});

router.get('/admin/products/new', (req, res) => {
  res.send('New products page');
});

module.exports = router;
