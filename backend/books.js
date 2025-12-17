const express = require('express');
const axios = require('axios');
const pool = require('./db');

const router = express.Router();

// Search books from Open Library API
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query; // q = query (book title, author, etc.)

    if (!q) {
      return res.status(400).json({
        success: false,
        error: 'Search query is required'
      });
    }

    // Search Open Library
    const response = await axios.get(`https://openlibrary.org/search.json`, {
      params: {
        q: q,
        limit: 20,
        fields: 'key,title,author_name,first_publish_year,isbn,number_of_pages_median,cover_i,publisher'
      }
    });

    // Format the results
    const books = response.data.docs.map(book => ({
      open_library_key: book.key,
      title: book.title,
      author: book.author_name ? book.author_name.join(', ') : 'Unknown Author',
      publication_year: book.first_publish_year,
      isbn: book.isbn ? book.isbn[0] : null,
      pages: book.number_of_pages_median,
      cover_url: book.cover_i 
        ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`
        : null,
      publisher: book.publisher ? book.publisher[0] : null
    }));

    res.json({
      success: true,
      count: books.length,
      books: books
    });

  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to search books'
    });
  }
});

// Get book details from Open Library
router.get('/details/:key', async (req, res) => {
  try {
    const { key } = req.params;

    // Get book details
    const response = await axios.get(`https://openlibrary.org${key}.json`);
    const book = response.data;

    // Get description (sometimes it's in a different format)
    let description = null;
    if (book.description) {
      description = typeof book.description === 'string' 
        ? book.description 
        : book.description.value;
    }

    res.json({
      success: true,
      book: {
        title: book.title,
        description: description,
        covers: book.covers ? book.covers.map(id => 
          `https://covers.openlibrary.org/b/id/${id}-L.jpg`
        ) : [],
        subjects: book.subjects || [],
        publish_date: book.publish_date,
        publishers: book.publishers || [],
        number_of_pages: book.number_of_pages
      }
    });

  } catch (error) {
    console.error('Details error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get book details'
    });
  }
});

// Add book to our database (when user adds to library)
router.post('/add', async (req, res) => {
  try {
    const { title, author, isbn, publisher, publication_year, pages, synopsis, cover_image_url } = req.body;

    if (!title || !author) {
      return res.status(400).json({
        success: false,
        error: 'Title and author are required'
      });
    }

    // Check if book already exists
    const existingBook = await pool.query(
      'SELECT * FROM books WHERE title = $1 AND author = $2',
      [title, author]
    );

    if (existingBook.rows.length > 0) {
      return res.json({
        success: true,
        message: 'Book already exists',
        book: existingBook.rows[0]
      });
    }

    // Insert new book
    const result = await pool.query(
      `INSERT INTO books (title, author, isbn, publisher, publication_year, pages, synopsis, cover_image_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [title, author, isbn, publisher, publication_year, pages, synopsis, cover_image_url]
    );

    res.status(201).json({
      success: true,
      message: 'Book added successfully',
      book: result.rows[0]
    });

  } catch (error) {
    console.error('Add book error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to add book'
    });
  }
});

// Get all books from our database
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM books ORDER BY created_at DESC LIMIT 50'
    );

    res.json({
      success: true,
      count: result.rows.length,
      books: result.rows
    });

  } catch (error) {
    console.error('Get books error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get books'
    });
  }
});

module.exports = router;