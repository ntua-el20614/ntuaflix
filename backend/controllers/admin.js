const { pool } = require('../utils/database');

exports.getHealth = async (req, res, next) => {
    try {
        await new Promise((resolve, reject) => {
            pool.query('SELECT 1', (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(true);
                }
            });
        });

        res.json({ status: "OK", dataconnection: "Database connection is successful" });
    } catch (error) {
        res.status(500).json({ status: "failed", dataconnection: error.message });
    }
};

exports.chUser = (req, res, next) => {

    const username = req.params.username;
    const password = req.params.password; // Ensure this is hashed if needed

    const query = `
    INSERT INTO ntuaflix.users (username, password_hashed)
    VALUES ('${username}', '${password}') AS new_values
    ON DUPLICATE KEY UPDATE password_hashed = new_values.password_hashed;
     `;
    pool.getConnection((err, connection) => {
        if (err) {
            return res.status(500).json({ message: 'Error connecting to the database' });
        }

        connection.query(query, [username, password], (err, results) => {
            connection.release();
            if (err) {
                return res.status(500).json({ message: 'Internal server error' });
            }

            return res.status(200).json({ message: 'Operation successful', new_password: `${password}`, data: results });
        });
    });
}


exports.getUser = (req, res, next) => {

    const username = req.params.username;
    const query = `SELECT * FROM users WHERE username = '${username}'`;

    pool.getConnection((err, connection) => {
        connection.query(query, (err, rows) => {
            connection.release();
            if (err) return res.status(500).json({ message: 'Internal server error' });

            return res.status(200).json(rows);
        });
    });

}

exports.getTest = (req, res, next) => {

    res.status(200).json({ status: "success" });
}