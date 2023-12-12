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
