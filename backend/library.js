const express = require('express');
const pool = require('./db');

const router = express.Router();

// Valid status values
const VALID_STATUSES = ['want_to_read', 'reading', 'finished', 'dnf'];

// Get user's library
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { status } = req.query; // Optional filter: want_to_read, reading, finished, dnf

    let query = `
      SELECT 
        ub.id as library_id,
        ub.status,
        ub.progress_percentage,
        ub.file_path,
        ub.file_format,
        ub.started_at,
        ub.finished_at,
        ub.added_at,
        b.id as book_id,
        b.title,
        b.author,
        b.cover_image_url,
        b.pages,
        b.publication_year
      FROM user_books ub
      JOIN books b ON ub.book_id = b.id
      WHERE ub.user_id = $1
    `;

    const params = [userId];

    if (status) {
      query += ' AND ub.status = $2';
      params.push(status);
    }

    query += ' ORDER BY ub.updated_at DESC';

    const result = await pool.query(query, params);

    res.json({
      success: true,
      count: result.rows.length,
      library: result.rows
    });

  } catch (error) {
    console.error('Get library error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get library'
    });
  }
});

// Add book to user's library
router.post('/add', async (req, res) => {
  try {
    const { user_id, book_id, status, file_path, file_format } = req.body;

    if (!user_id || !book_id || !status) {
      return res.status(400).json({
        success: false,
        error: 'user_id, book_id, and status are required'
      });
    }

    // Validate status
    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        error: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}`
      });
    }

    // Check if book exists
    const bookCheck = await pool.query('SELECT * FROM books WHERE id = $1', [book_id]);
    if (bookCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Book not found'
      });
    }

    // Check if already in library
    const existingEntry = await pool.query(
      'SELECT * FROM user_books WHERE user_id = $1 AND book_id = $2',
      [user_id, book_id]
    );

    if (existingEntry.rows.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Book already in library'
      });
    }

    // Add to library
    const result = await pool.query(
      `INSERT INTO user_books (user_id, book_id, status, file_path, file_format, started_at)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        user_id,
        book_id,
        status,
        file_path || null,
        file_format || null,
        status === 'reading' ? new Date() : null
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Book added to library',
      library_entry: result.rows[0]
    });

  } catch (error) {
    console.error('Add to library error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to add book to library'
    });
  }
});

// Update book status in library
router.put('/update/:libraryId', async (req, res) => {
  try {
    const { libraryId } = req.params;
    const { status, progress_percentage, file_path, file_format } = req.body;

    // Validate status if provided
    if (status && !VALID_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        error: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}`
      });
    }

    // Build dynamic update query
    const updates = [];
    const values = [];
    let paramCount = 1;

    if (status) {
      updates.push(`status = $${paramCount}`);
      values.push(status);
      paramCount++;

      // Set timestamps based on status
      if (status === 'reading') {
        updates.push(`started_at = COALESCE(started_at, NOW())`);
      } else if (status === 'finished') {
        updates.push(`finished_at = NOW()`);
        updates.push(`progress_percentage = 100`);
      } else if (status === 'dnf') {
        updates.push(`finished_at = NOW()`);
        // Keep current progress for DNF books
      }
    }

    if (progress_percentage !== undefined) {
      updates.push(`progress_percentage = $${paramCount}`);
      values.push(progress_percentage);
      paramCount++;
    }

    if (file_path !== undefined) {
      updates.push(`file_path = $${paramCount}`);
      values.push(file_path);
      paramCount++;
    }

    if (file_format !== undefined) {
      updates.push(`file_format = $${paramCount}`);
      values.push(file_format);
      paramCount++;
    }

    updates.push(`updated_at = NOW()`);

    values.push(libraryId);

    const query = `
      UPDATE user_books 
      SET ${updates.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Library entry not found'
      });
    }

    res.json({
      success: true,
      message: 'Library entry updated',
      library_entry: result.rows[0]
    });

  } catch (error) {
    console.error('Update library error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update library entry'
    });
  }
});

// Remove book from library
router.delete('/remove/:libraryId', async (req, res) => {
  try {
    const { libraryId } = req.params;

    const result = await pool.query(
      'DELETE FROM user_books WHERE id = $1 RETURNING *',
      [libraryId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Library entry not found'
      });
    }

    res.json({
      success: true,
      message: 'Book removed from library'
    });

  } catch (error) {
    console.error('Remove from library error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to remove book from library'
    });
  }
});

// Get reading statistics for user
router.get('/stats/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const stats = await pool.query(`
      SELECT 
        COUNT(*) FILTER (WHERE status = 'want_to_read') as want_to_read_count,
        COUNT(*) FILTER (WHERE status = 'reading') as reading_count,
        COUNT(*) FILTER (WHERE status = 'finished') as finished_count,
        COUNT(*) FILTER (WHERE status = 'dnf') as dnf_count,
        COUNT(*) as total_books,
        AVG(progress_percentage) FILTER (WHERE status = 'reading') as avg_progress
      FROM user_books
      WHERE user_id = $1
    `, [userId]);

    res.json({
      success: true,
      stats: stats.rows[0]
    });

  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get statistics'
    });
  }
});

module.exports = router;