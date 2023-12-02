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


exports.getAllInfoForMovieById = (req, res, next) => {
    const id = req.params.id;


    const query = `

    SELECT 
    T.tconst, 
    MAX(T.titletype) AS titletype, 
    MAX(T.primarytitle) AS primarytitle, 
    MAX(T.originaltitle) AS originaltitle, 
    MAX(T.isAdult) AS isAdult, 
    MAX(T.startYear) AS startYear, 
    MAX(T.endYear) AS endYear, 
    MAX(T.runtimeMinutes) AS runtimeMinutes, 
    MAX(T.genres) AS genres, 
    MAX(T.img_url_asset) AS img_url_asset, 
    GROUP_CONCAT(DISTINCT CONCAT('seasonN:', IFNULL(E.seasonN, ''), '|episodeN:', IFNULL(E.episodeN, '')) SEPARATOR ';') AS episodes_info,
    MAX(R.averageRate) AS averageRate, 
    MAX(R.numVotes) AS numVotes, 
    MAX(C.directors) AS directors, 
    MAX(C.writers) AS writers,
    GROUP_CONCAT(DISTINCT CONCAT('ordering:', A.ordering, '|title:', IFNULL(A.title, ''), '|region:', IFNULL(A.region, ''), '|language:', IFNULL(A.language, ''), '|types:', IFNULL(A.types, ''), '|attributes:', IFNULL(A.attributes, ''), '|isOriginalTitle:', IFNULL(A.isOriginalTitle, '')) SEPARATOR ';') AS aka_info
FROM 
    Titles T
LEFT JOIN 
    Episodes E ON T.tconst = E.parentTconst
LEFT JOIN 
    Title_ratings R ON T.tconst = R.titleid
LEFT JOIN 
    Title_crew C ON T.tconst = C.tconst
LEFT JOIN 
    Title_akas A ON T.tconst = A.tconst
WHERE 
    T.tconst = "${id}"
GROUP BY 
    T.tconst;

    `;

    pool.getConnection((err, connection) => {
        connection.query(query, (err, rows) => {
            connection.release();
            if (err) return res.status(500).json({ message: 'Internal server error' });

            return res.status(200).json(rows);
        });
    });
}

