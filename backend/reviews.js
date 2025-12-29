const express = require('express');
const pool = require('./db');

const router = express.Router();

// Get user's review for a specific book
router.get('/user/:userId/book/:bookId', async (req, res) => {
  try {
    const { userId, bookId } = req.params;

    const result = await pool.query(
      'SELECT * FROM reviews WHERE user_id = $1 AND book_id = $2',
      [userId, bookId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Review not found'
      });
    }

    res.json({
      success: true,
      review: result.rows[0]
    });

  } catch (error) {
    console.error('Get review error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get review'
    });
  }
});

// Get all reviews for a book
router.get('/book/:bookId', async (req, res) => {
  try {
    const { bookId } = req.params;

    const result = await pool.query(`
      SELECT r.*, u.username, u.display_name
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      WHERE r.book_id = $1
      ORDER BY r.created_at DESC
    `, [bookId]);

    res.json({
      success: true,
      count: result.rows.length,
      reviews: result.rows
    });

  } catch (error) {
    console.error('Get book reviews error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get reviews'
    });
  }
});

// Get all reviews by a user
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const result = await pool.query(`
      SELECT r.*, b.title, b.author, b.cover_image_url
      FROM reviews r
      JOIN books b ON r.book_id = b.id
      WHERE r.user_id = $1
      ORDER BY r.created_at DESC
    `, [userId]);

    res.json({
      success: true,
      count: result.rows.length,
      reviews: result.rows
    });

  } catch (error) {
    console.error('Get user reviews error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get reviews'
    });
  }
});

// Create or update review
router.post('/add', async (req, res) => {
  try {
    const { user_id, book_id, rating, review_text } = req.body;

    if (!user_id || !book_id) {
      return res.status(400).json({
        success: false,
        error: 'user_id and book_id are required'
      });
    }

    if (rating && (rating < 1 || rating > 5)) {
      return res.status(400).json({
        success: false,
        error: 'Rating must be between 1 and 5'
      });
    }

    // Check if review already exists
    const existingReview = await pool.query(
      'SELECT * FROM reviews WHERE user_id = $1 AND book_id = $2',
      [user_id, book_id]
    );

    let result;

    if (existingReview.rows.length > 0) {
      // Update existing review
      result = await pool.query(`
        UPDATE reviews 
        SET rating = $1, review_text = $2, updated_at = NOW()
        WHERE user_id = $3 AND book_id = $4
        RETURNING *
      `, [rating, review_text, user_id, book_id]);

      res.json({
        success: true,
        message: 'Review updated successfully',
        review: result.rows[0]
      });
    } else {
      // Create new review
      result = await pool.query(`
        INSERT INTO reviews (user_id, book_id, rating, review_text)
        VALUES ($1, $2, $3, $4)
        RETURNING *
      `, [user_id, book_id, rating, review_text]);

      res.status(201).json({
        success: true,
        message: 'Review created successfully',
        review: result.rows[0]
      });
    }

  } catch (error) {
    console.error('Add review error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to add review'
    });
  }
});

// Delete review
router.delete('/:reviewId', async (req, res) => {
  try {
    const { reviewId } = req.params;

    const result = await pool.query(
      'DELETE FROM reviews WHERE id = $1 RETURNING *',
      [reviewId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Review not found'
      });
    }

    res.json({
      success: true,
      message: 'Review deleted successfully'
    });

  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete review'
    });
  }
});

module.exports = router;