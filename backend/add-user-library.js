const pool = require('./db');

async function addUserLibrary() {
  try {
    console.log('Creating user_books table...');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS user_books (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        book_id UUID REFERENCES books(id) ON DELETE CASCADE,
        status VARCHAR(20) NOT NULL CHECK (status IN ('want_to_read', 'reading', 'finished')),
        file_path VARCHAR(500),
        file_format VARCHAR(10),
        progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
        progress_location TEXT,
        started_at TIMESTAMP,
        finished_at TIMESTAMP,
        added_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(user_id, book_id)
      );
    `);

    console.log('✓ user_books table created successfully!');
    console.log('\nYou can now add books to user libraries! 🎉\n');
    process.exit(0);

  } catch (error) {
    console.error('Error creating table:', error);
    process.exit(1);
  }
}

addUserLibrary();