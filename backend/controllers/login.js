// controllers/login.js

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../utils/database.js');

exports.login = async (req, res) => {
    // Extract username and password from request body
    const { username, password } = req.body;

    try {
        // Query database for user
        const query = 'SELECT userID, username, password_hashed FROM users WHERE username = ?';
        const [users] = await pool.query(query, [username]);

        // Check if user exists
        if (users.length === 0) {
            return res.status(401).json({ message: 'Authentication failed' });
        }

        // User exists, check password
        const user = users[0];
        const passwordIsValid = await bcrypt.compare(password, user.password_hashed);

        if (!passwordIsValid) {
            return res.status(401).json({ message: 'Authentication failed' });
        }

        // Create JWT token
        const token = jwt.sign(
            { userId: user.userID, username: user.username },
            process.env.JWT_SECRET || '3141592653589793236264', // Use environment variable or replace with your actual key
            { expiresIn: '1h' }
        );

        // Send token in response
        res.status(200).json({ token: token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong with the server.' });
    }
};
