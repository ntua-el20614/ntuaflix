// controllers/login.js

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../utils/database.js');

exports.login = async (req, res) => {
    // Extract username and password from request body
    const { username, password } = req.body;

    try {
        // Query database for user
        const query = 'SELECT * FROM users WHERE username = ?';
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
        if(user.approved == 0){
            return res.status(401).json({ message: 'User not approved' });
        }

        // Create JWT token
        const token = jwt.sign(
            { userId: user.userID, username: user.username, is_admin: user.is_admin },
            process.env.JWT_SECRET || "1234", // Use environment variable or replace with your actual key
            { expiresIn: '5h' }
        );

        // Send token in response (no longer storing the token in the database)
        res.status(200).json({ token: token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong with the server.' });
    }
};


exports.signup = async (req, res) => {
    // Extract username and password from request body
    const { username, password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt); 

    // Query database for user
    const query = `INSERT INTO users (username, password_hashed, approved) 
    VALUES (?, ?, ?)`;
    try {
        const [results] = await pool.query(query, [username, hashedPassword, 0]);
        res.status(200).json({ message: 'Operation successful', data: results });
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
};
