//This helps to test connectivity with the database
//Open terminal cd utils and type 'node testConnection.js'
//If you see "Database connection successful: [ { '1': 1 } ]" you are connected successfully
const { pool } = require('./database');

async function testDatabaseConnection() {
  try {
    // Attempt a simple query - SELECT 1 is a common choice
    const [results] = await pool.query('SELECT 1');
    
    // If no error is thrown, the connection is successful
    console.log('Database connection successful:', results);
  } catch (err) {
    // Log any errors
    console.error('Database connection failed:', err);
  }
}

testDatabaseConnection();
