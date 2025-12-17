const pool = require('./db');

async function setupDatabase() {
  try {
    console.log('Creating database tables...');

    // Create Users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        display_name VARCHAR(100),
        bio TEXT,
        profile_picture_url VARCHAR(500),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✓ Users table created');

    // Create Books table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS books (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title VARCHAR(500) NOT NULL,
        author VARCHAR(255) NOT NULL,
        isbn VARCHAR(20),
        publisher VARCHAR(255),
        publication_year INTEGER,
        pages INTEGER,
        synopsis TEXT,
        cover_image_url VARCHAR(500),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✓ Books table created');

    // Create Genres table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS genres (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(100) UNIQUE NOT NULL
      );
    `);
    console.log('✓ Genres table created');

    // Create Book_Genres junction table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS book_genres (
        book_id UUID REFERENCES books(id) ON DELETE CASCADE,
        genre_id UUID REFERENCES genres(id) ON DELETE CASCADE,
        PRIMARY KEY (book_id, genre_id)
      );
    `);
    console.log('✓ Book_Genres table created');

    console.log('\nDatabase setup complete! 🎉');
    process.exit(0);
  } catch (error) {
    console.error('Error setting up database:', error);
    process.exit(1);
  }
}

setupDatabase();