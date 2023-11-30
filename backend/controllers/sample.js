const { pool } = require('../utils/database');


exports.getSample = (req, res, next) => {
    res.status(200).json({ message: 'Hello World!' });
}
exports.getMovies = (req, res, next) => {

    const query = `SELECT * FROM Titles WHERE titletype = \'movie\'`;
    
    pool.getConnection((err, connection) => {
        connection.query(query, (err, rows) => {
            connection.release();
            if (err) return res.status(500).json({ message: 'Internal server error' });

            return res.status(200).json(rows);
        });
    });

}

exports.getMovieById = (req, res, next) => {
    const id = req.params.id;


    const query = `SELECT * FROM Titles WHERE tconst = '${id}'`;
    
    pool.getConnection((err, connection) => {
        connection.query(query, (err, rows) => {
            connection.release();
            if (err) return res.status(500).json({ message: 'Internal server error' });

            return res.status(200).json(rows);
        });
    });
}

exports.postSample = (req, res, next) => {
    const id = req.params.id;
    const body = req.body;
    
    if (!body.name) return res.status(400).json({ message: 'Name body param is required' });
    res.status(200).json({ message: `Hello World! ${id}`, body });
}