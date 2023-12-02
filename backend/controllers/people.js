const { pool } = require('../utils/database');


exports.getPeople = (req, res, next) => {

    const query = `SELECT * FROM People`;

    pool.getConnection((err, connection) => {
        connection.query(query, (err, rows) => {
            connection.release();
            if (err) return res.status(500).json({ message: 'Internal server error' });

            return res.status(200).json(rows);
        });
    });

}


exports.getTypeOfPeople = (req, res, next) => {
    const profession = req.params.profession;

    const query = `SELECT * FROM people WHERE primaryProfession LIKE "%${profession}%"`;
    console.log(query);
    pool.getConnection((err, connection) => {
        connection.query(query, (err, rows) => {
            connection.release();
            if (err) return res.status(500).json({ message: 'Internal server error' });

            return res.status(200).json(rows);
        });
    });

}
exports.getTypeOfPeopleOneProfession = (req, res, next) => {
    const profession = req.params.profession;

    const query = `SELECT * FROM people WHERE primaryProfession LIKE "${profession}"`;
    console.log(query);
    pool.getConnection((err, connection) => {
        connection.query(query, (err, rows) => {
            connection.release();
            if (err) return res.status(500).json({ message: 'Internal server error' });

            return res.status(200).json(rows);
        });
    });

}