const express = require('express');
const { validationResult } = require('express-validator');
const productRepo = require('../../repositories/products');
const productsNewTemplate = require('../../views/admin/products/new');
const { validateTitle, validatePrice } = require('./validators');

const router = express.Router();

router.get('/admin/products', (req, res) => {
  res.send('Product page');
});

router.get('/admin/products/new', (req, res) => {
  res.send(productsNewTemplate({}));
});

router.post(
  '/admin/products/new',
  [validateTitle, validatePrice],
  (req, res) => {
    const errors = validationResult(req);
    console.log(errors);
    res.send('submitted');
  }
);

module.exports = router;
