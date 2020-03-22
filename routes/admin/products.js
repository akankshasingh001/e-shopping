const express = require('express');
const multer = require('multer');

const { handleErrors } = require('./middleware');
const productRepo = require('../../repositories/products');
const productsNewTemplate = require('../../views/admin/products/new');
const { validateTitle, validatePrice } = require('./validators');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get('/admin/products', (req, res) => {
  res.send('Product page');
});

router.get('/admin/products/new', (req, res) => {
  res.send(productsNewTemplate({}));
});

router.post(
  '/admin/products/new',
  upload.single('image'),
  [validateTitle, validatePrice],
  handleErrors(productsNewTemplate),
  async (req, res) => {
    const image = req.file.buffer.toString('base64');
    const { title, price } = req.body;
    await productRepo.create({ title, price, image });
    res.send('submitted');
  }
);

module.exports = router;
