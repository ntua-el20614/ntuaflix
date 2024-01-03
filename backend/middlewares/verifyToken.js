// middlewares/verifyToken.js

const jwt = require('jsonwebtoken');
const { pool } = require('../utils/database.js');

const verifyToken = async (req, res, next) => {
    const token = req.headers['token']; // Replace 'x-custom-header' with your header's name

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || '3141592653589793236264');
        const [results] = await pool.query('SELECT userID FROM users WHERE token = ?', [token]);
        
        if (results.length === 0) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        req.userId = results[0].userID;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized', error: error.message });
    }
};

module.exports = verifyToken;
