const { pool } = require('../utils/database.js');

exports.logout = async (req, res) => {
    // Extract the user's ID from the token, which should be done by middleware before this controller
    const userId = req.userId;  // This should be set by a middleware that decodes the JWT

    try {
        // Set the token to null in the database for this user
        await pool.query('UPDATE users SET token = NULL WHERE userID = ?', [userId]);

        res.status(200).json({message: 'Logout Successfully'});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong with the server.' });
    }
};
