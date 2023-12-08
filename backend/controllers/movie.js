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
    const titleID = req.params.titleID;


    const query = `
    
    SELECT 
    T.tconst AS titleID,
    T.titletype AS type,
    T.originaltitle AS originalTitle,
    T.img_url_asset AS titlePoster,
    T.startYear,
    T.endYear,
    CONCAT(
        '[',
        GROUP_CONCAT(DISTINCT JSON_OBJECT('genreTitle', TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(T.genres, ',', numbers.n), ',', -1))) ORDER BY TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(T.genres, ',', numbers.n), ',', -1)) SEPARATOR ','),
        ']'
    ) AS genres,
    JSON_OBJECT('avRating', TR.averageRate, 'nVotes', TR.numVotes) AS rating,
    TA.titleAkas,
    TP.principals
FROM ntuaflix.Titles T
LEFT JOIN ntuaflix.Title_ratings TR ON T.tconst = TR.titleid
LEFT JOIN (
    SELECT 
        tconst, 
        JSON_ARRAYAGG(JSON_OBJECT('akaTitle', title, 'regionAbbrev', region)) AS titleAkas
    FROM ntuaflix.title_akas
    GROUP BY tconst
) TA ON T.tconst = TA.tconst
LEFT JOIN (
    SELECT 
        TP.tconst, 
        JSON_ARRAYAGG(JSON_OBJECT('nameID', TP.nconst, 'name', P.primaryName, 'category', TP.category)) AS principals
    FROM ntuaflix.title_principals TP
    JOIN ntuaflix.people P ON TP.nconst = P.nconst
    GROUP BY TP.tconst
) TP ON T.tconst = TP.tconst,
LATERAL (
    SELECT 1 n UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5
) AS numbers
WHERE T.tconst = '${titleID}'
AND CHAR_LENGTH(T.genres) - CHAR_LENGTH(REPLACE(T.genres, ',', '')) >= numbers.n - 1
GROUP BY T.tconst, TA.titleAkas, TP.principals;


    `;

    pool.getConnection((err, connection) => {
        connection.query(query, (err, rows) => {
            connection.release();
            if (err) return res.status(500).json({ message: 'Internal server error' });

            return res.status(200).json(rows);
        });
    });
}

