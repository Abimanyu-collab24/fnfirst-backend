const express = require('express');
const router = express.Router();

const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/product.controller');

// GET all products
router.get('/products', getProducts);

// GET product by id
router.get('/products/:id', getProductById);

// CREATE product
router.post('/products', createProduct);

// UPDATE product
router.put('/products/:id', updateProduct);

// DELETE product
router.delete('/products/:id', deleteProduct);

module.exports = router;

