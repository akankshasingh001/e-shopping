const express = require('express');
const multer = require('multer');

const { handleErrors, requireAuth } = require('./middleware');
const productRepo = require('../../repositories/products');
const productsNewTemplate = require('../../views/admin/products/new');
const productsIndexTemplate = require('../../views/admin/products/index');
const productsEditTemplate = require('../../views/admin/products/edit');
const { validateTitle, validatePrice } = require('./validators');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get('/admin/products', requireAuth, async (req, res) => {
  const products = await productRepo.getAll();
  res.send(productsIndexTemplate({ products }));
});

router.get('/admin/products/new', requireAuth, (req, res) => {
  res.send(productsNewTemplate({}));
});

router.post(
  '/admin/products/new',
  requireAuth,
  upload.single('image'),
  [validateTitle, validatePrice],
  handleErrors(productsNewTemplate),
  async (req, res) => {
    const image = req.file.buffer.toString('base64');
    const { title, price } = req.body;
    await productRepo.create({ title, price, image });

    res.redirect('/admin/products');
  }
);

router.get('/admin/products/:id/edit', requireAuth, async (req, res) => {
  const product = await productRepo.getOne(req.params.id);
  if (!product) {
    res.send('Product not found!');
  }

  res.send(productsEditTemplate({ product }));
});

router.post('/admin/products/:id/edit', requireAuth, async (req, res) => {});

module.exports = router;
