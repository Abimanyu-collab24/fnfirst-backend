const db = require('../config/db');

// GET semua kategori
exports.getCategories = (req, res) => {
  db.query('SELECT * FROM categories', (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to get categories', error: err });
    }
    res.json(results);
  });
};

// GET kategori by ID
exports.getCategoryById = (req, res) => {
  const { id } = req.params;

  db.query('SELECT * FROM categories WHERE id = ?', [id], (err, results) => {
    if (err) return res.status(500).json(err);
    if (results.length === 0)
      return res.status(404).json({ message: 'Category not found' });

    res.json(results[0]);
  });
};

// CREATE kategori
exports.createCategory = (req, res) => {
  const { name } = req.body;

  // 🔒 VALIDASI MINIMAL
  if (!name || name.trim() === '') {
    return res.status(400).json({
      message: 'Category name is required'
    });
  }

  const sql = 'INSERT INTO categories (name) VALUES (?)';

  db.query(sql, [name], (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }

    res.status(201).json({
      message: 'Category created successfully',
      id: result.insertId
    });
  });
};


// UPDATE kategori
exports.updateCategory = (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  db.query(
    'UPDATE categories SET name = ? WHERE id = ?',
    [name, id],
    (err, result) => {
      if (err) return res.status(500).json(err);
      if (result.affectedRows === 0)
        return res.status(404).json({ message: 'Category not found' });

      res.json({ message: 'Category updated successfully' });
    }
  );
};

// DELETE kategori
exports.deleteCategory = (req, res) => {
  const { id } = req.params;

  db.query('DELETE FROM categories WHERE id = ?', [id], (err, result) => {
    if (err) return res.status(500).json(err);
    if (result.affectedRows === 0)
      return res.status(404).json({ message: 'Category not found' });

    res.json({ message: 'Category deleted successfully' });
  });
};
