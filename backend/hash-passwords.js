const bcrypt = require('bcryptjs');
const { pool } = require('./utils/database.js');

async function hashPasswords() {
  try {
    // Fetch all users' plaintext passwords - caution, handle with care!
    const [users] = await pool.query('SELECT userID, password_hashed FROM users');

    for (const user of users) {
      const hashedPassword = await bcrypt.hash(user.password_hashed, 10); // Use a salt round of 10
      await pool.query('UPDATE users SET password_hashed = ? WHERE userID = ?', [hashedPassword, user.userID]);
    }

    console.log('All passwords have been hashed.');
  } catch (error) {
    console.error('Error hashing passwords: ', error);
  }
}

// Call the function
hashPasswords();
