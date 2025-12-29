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
    const { title, author, isbn, publisher, publication_year, pages, synopsis, cover_image_url, open_library_key } = req.body;

    console.log('=== ADD BOOK REQUEST ===');
    console.log('Title:', title);
    console.log('Author:', author);
    console.log('Open Library Key:', open_library_key);

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
      console.log('Book already exists with ID:', existingBook.rows[0].id);
      return res.json({
        success: true,
        message: 'Book already exists',
        book: existingBook.rows[0]
      });
    }

    // Try to fetch description from Open Library if we have the key
    let description = synopsis;
    let rating = null;
    let ratingsCount = 0;

    if (open_library_key && !description) {
      try {
        console.log('Fetching description from Open Library...');
        const olResponse = await axios.get(`https://openlibrary.org${open_library_key}.json`, {
          timeout: 5000
        });
        const olData = olResponse.data;

        // Get description
        if (olData.description) {
          description = typeof olData.description === 'string' 
            ? olData.description 
            : olData.description.value;
          console.log('Got description (first 100 chars):', description ? description.substring(0, 100) : 'null');
        }

        // Try to get ratings (if available)
        try {
          const ratingsResponse = await axios.get(
            `https://openlibrary.org${open_library_key}/ratings.json`,
            { timeout: 3000 }
          );
          if (ratingsResponse.data.summary?.average) {
            rating = Math.round(ratingsResponse.data.summary.average * 10) / 10;
            ratingsCount = ratingsResponse.data.summary.count || 0;
            console.log('Got rating:', rating, 'from', ratingsCount, 'ratings');
          }
        } catch (ratingError) {
          console.log('No ratings available');
        }
      } catch (error) {
        console.log('Could not fetch Open Library details:', error.message);
        // Continue without description - not a critical error
      }
    }

    // Insert new book
    console.log('Inserting book into database...');
    console.log('Values:', {
      title,
      author,
      isbn: isbn || null,
      publisher: publisher || null,
      publication_year: publication_year || null,
      pages: pages || null,
      synopsis: description ? description.substring(0, 50) + '...' : null,
      rating,
      ratingsCount
    });

    const result = await pool.query(
      `INSERT INTO books (title, author, isbn, publisher, publication_year, pages, synopsis, cover_image_url, rating, ratings_count)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [title, author, isbn, publisher, publication_year, pages, description, cover_image_url, rating, ratingsCount]
    );

    console.log('Book inserted successfully with ID:', result.rows[0].id);

    res.status(201).json({
      success: true,
      message: 'Book added successfully',
      book: result.rows[0]
    });

  } catch (error) {
    console.error('=== ADD BOOK ERROR ===');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      success: false,
      error: 'Failed to add book',
      details: error.message
    });
  }
});

// Get single book by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'SELECT * FROM books WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Book not found'
      });
    }

    res.json(result.rows[0]);

  } catch (error) {
    console.error('Get book by ID error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get book'
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