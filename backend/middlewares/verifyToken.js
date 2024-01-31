const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    
    const token = req.headers['authorization']?.split(' ')[1]; // Common practice to use 'Bearer <token>'

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || '1234');
        req.userId = decoded.userId;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized', error: error.message });
    }
};

module.exports = verifyToken;
