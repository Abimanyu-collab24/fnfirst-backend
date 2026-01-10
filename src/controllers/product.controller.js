const db = require('../config/db');

// GET semua produk + kategori
exports.getProducts = (req, res) => {

  // =========================
  // STEP 1 — PAGINATION
  // =========================
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  // =========================
  // STEP 2 — FILTER & SEARCH
  // =========================
  const {
    category,
    search,
    minPrice,
    maxPrice,
    sort,
    order
  } = req.query;

  let sql = `
    SELECT
      p.id,
      p.name,
      p.description,
      p.price,
      p.stock,
      p.created_at,
      c.name AS category
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
  `;

  const conditions = [];
  const params = [];

  // 🔍 SEARCH
  if (search) {
    conditions.push(`p.name LIKE ?`);
    params.push(`%${search}%`);
  }

  // 🏷 CATEGORY
  if (category) {
    conditions.push(`c.name = ?`);
    params.push(category);
  }

  // 💰 MIN PRICE
  if (minPrice) {
    conditions.push(`p.price >= ?`);
    params.push(minPrice);
  }

  // 💰 MAX PRICE
  if (maxPrice) {
    conditions.push(`p.price <= ?`);
    params.push(maxPrice);
  }

  // 🧠 GABUNGKAN KONDISI
  if (conditions.length > 0) {
    sql += ` WHERE ` + conditions.join(' AND ');
  }

  // =========================
  // STEP 3 — SORTING (AMAN)
  // =========================
  const allowedSort = ['price', 'created_at', 'name'];
  const sortField = allowedSort.includes(sort) ? sort : 'created_at';
  const sortOrder = order === 'asc' ? 'ASC' : 'DESC';

  sql += ` ORDER BY p.${sortField} ${sortOrder}`;

  // =========================
  // STEP 4 — PAGINATION SQL
  // =========================
  sql += ` LIMIT ? OFFSET ?`;
  params.push(limit, offset);

  // =========================
  // EXECUTE QUERY
  // =========================
  db.query(sql, params, (err, results) => {
    if (err) {
      return res.status(500).json({
        message: 'Failed to get products',
        error: err
      });
    }

    res.status(200).json({
      page,
      limit,
      total: results.length,
      data: results
    });
  });
};





// GET product by ID
exports.getProductById = (req, res) => {
  const { id } = req.params;

  const sql = "SELECT * FROM products WHERE id = ?";

  db.query(sql, [id], (err, results) => {
    if (err) {
      return res.status(500).json({
        message: "Failed to get product",
        error: err
      });
    }

    // kalau data tidak ditemukan
    if (results.length === 0) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    res.status(200).json(results[0]);
  });
};

// CREATE produk 
exports.createProduct = (req, res) => {
  const { name, description, price, stock, category_id } = req.body;

  // 1. Validasi wajib
  if (!name || !price || !stock || !category_id) {
    return res.status(400).json({
      message: 'name, price, stock, dan category_id wajib diisi'
    });
  }

  // 2. Cek apakah category_id ada
  const checkCategorySql = 'SELECT id FROM categories WHERE id = ?';

  db.query(checkCategorySql, [category_id], (err, catResult) => {
    if (err) {
      return res.status(500).json({ error: err });
    }

    if (catResult.length === 0) {
      return res.status(400).json({
        message: 'Category tidak ditemukan'
      });
    }

    // 3. Insert product
    const sql = `
      INSERT INTO products 
      (name, description, price, stock, category_id) 
      VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
      sql,
      [name, description || null, price, stock, category_id],
      (err, result) => {
        if (err) {
          return res.status(500).json({
            message: 'Failed to create product',
            error: err
          });
        }

        res.status(201).json({
          message: 'Product created successfully',
          id: result.insertId
        });
      }
    );
  });
};

// UPDATE product
exports.updateProduct = (req, res) => {
  const { id } = req.params;
  const { name, description, price, stock, category_id } = req.body;

  const sql = `
    UPDATE products
    SET name = ?, description = ?, price = ?, stock = ?, category_id = ?
    WHERE id = ?
  `;

  db.query(
    sql,
    [name, description, price, stock, category_id, id],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          message: 'Failed to update product',
          error: err
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          message: 'Product not found'
        });
      }

      res.json({
        message: 'Product updated successfully'
      });
    }
  );
};

// DELETE product
exports.deleteProduct = (req, res) => {
  const { id } = req.params;

  const sql = 'DELETE FROM products WHERE id = ?';

  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({
        message: 'Failed to delete product',
        error: err
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: 'Product not found'
      });
    }

    res.json({
      message: 'Product deleted successfully'
    });
  });
};
