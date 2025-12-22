const express = require('express');
const cors = require('cors');
const pool = require('./db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const authRoutes = require('./auth');
const bookRoutes = require('./books');
const libraryRoutes = require('./library');
const reviewsRoutes = require('./reviews'); // ADD THIS LINE

// Get user's library
app.get('/api/library', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const userId = decoded.userId;

    const result = await pool.query(
      `SELECT * FROM user_library 
       WHERE user_id = $1 
       ORDER BY created_at DESC`,
      [userId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching library:', error);
    res.status(500).json({ error: 'Failed to fetch library' });
  }
});

// Add book to library
app.post('/api/library', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const userId = decoded.userId;

    const { book_id, status, rating, review } = req.body;

    const result = await pool.query(
      `INSERT INTO user_library (user_id, book_id, status, rating, review)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (user_id, book_id) 
       DO UPDATE SET status = $3, rating = $4, review = $5, updated_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [userId, book_id, status, rating, review]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error adding to library:', error);
    res.status(500).json({ error: 'Failed to add to library' });
  }
});

// Update book in library
app.put('/api/library/:id', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const userId = decoded.userId;

    const { id } = req.params;
    const { status, rating, review } = req.body;

    const result = await pool.query(
      `UPDATE user_library 
       SET status = COALESCE($1, status),
           rating = COALESCE($2, rating),
           review = COALESCE($3, review),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $4 AND user_id = $5
       RETURNING *`,
      [status, rating, review, id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Book not found in library' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating library:', error);
    res.status(500).json({ error: 'Failed to update library' });
  }
});

// Delete book from library
app.delete('/api/library/:id', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const userId = decoded.userId;

    const { id } = req.params;

    await pool.query(
      'DELETE FROM user_library WHERE id = $1 AND user_id = $2',
      [id, userId]
    );

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting from library:', error);
    res.status(500).json({ error: 'Failed to delete from library' });
  }
});

// Middleware
app.use(cors());
app.use(express.json());
// Auth routes
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/library', libraryRoutes);
app.use('/api/reviews', reviewsRoutes); // ADD THIS LINE

// Test route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to TomeTrack API!',
    status: 'running',
    timestamp: new Date().toISOString()
  });
});

// Get all users (test endpoint)
// Get current user's profile (requires authentication)
app.get('/api/users/profile', async (req, res) => {
  try {
    // Get user ID from token
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const userId = decoded.userId;

    // Get user data
    const result = await pool.query(
      'SELECT id, username, email, display_name, bio, created_at FROM users WHERE id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(result.rows[0]);

  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Get user stats (books, reviews, followers, following)
app.get('/api/users/stats', async (req, res) => {
  try {
    // Get user ID from token
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const userId = decoded.userId;

    // Count books in library
    const booksResult = await pool.query(
      'SELECT COUNT(*) as count FROM user_library WHERE user_id = $1',
      [userId]
    );

    // Count reviews (when we add reviews table)
    const reviewsCount = 0; // TODO: Add when reviews table exists

    // Count followers (when we add follows table)
    const followersCount = 0; // TODO: Add when follows table exists

    // Count following (when we add follows table)
    const followingCount = 0; // TODO: Add when follows table exists

    res.json({
      books_count: parseInt(booksResult.rows[0].count),
      reviews_count: reviewsCount,
      followers_count: followersCount,
      following_count: followingCount
    });

  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// Get all books (test endpoint)
app.get('/api/books', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM books ORDER BY created_at DESC LIMIT 20');
    res.json({
      success: true,
      count: result.rows.length,
      books: result.rows
    });
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch books' 
    });
  }
});

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT NOW()');
    res.json({ 
      status: 'healthy',
      database: 'connected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'unhealthy',
      database: 'disconnected',
      error: error.message
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 TomeTrack API Server is running!`);
  console.log(`📍 Local: http://localhost:${PORT}`);
  console.log(`🔗 API endpoint: http://localhost:${PORT}/api`);
  console.log(`\nPress Ctrl+C to stop the server\n`);
});