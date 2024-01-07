const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.headers['token']; // or 'Authorization' if you follow the standard header

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || '3141592653589793236264');
        
        // If token is valid, store the decoded information (e.g., userId) in the request
        // for use in your route handlers
        req.userId = decoded.userId;

        next();
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized', error: error.message });
    }
};

module.exports = verifyToken;
