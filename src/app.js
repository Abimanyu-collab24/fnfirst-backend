const express = require('express');
const cors = require('cors');
require('dotenv').config();

const productRoutes = require('./routes/product.routes');
const categoryRoutes = require('./routes/category.routes'); // ✅ BARU

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('FnFirst Backend is running 🚀');
});

app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);


module.exports = app;
