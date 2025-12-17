const express = require('express');
const cors = require('cors');
const pool = require('./db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const authRoutes = require('./auth');
const bookRoutes = require('./books');
const libraryRoutes = require('./library');

// Middleware
app.use(cors());
app.use(express.json());
// Auth routes
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/library', libraryRoutes);

// Test route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to TomeTrack API!',
    status: 'running',
    timestamp: new Date().toISOString()
  });
});

// Get all users (test endpoint)
app.get('/api/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, username, display_name, created_at FROM users');
    res.json({
      success: true,
      count: result.rows.length,
      users: result.rows
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch users' 
    });
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