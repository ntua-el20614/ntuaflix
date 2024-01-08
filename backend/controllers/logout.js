// controllers/logout.js

exports.logout = async (req, res) => {
    try {
        // Perform any server-side cleanup if needed
        // For example, invalidating server-side session, if you use sessions

        // Respond to the client indicating successful logout
        res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong with the server.' });
    }
};
