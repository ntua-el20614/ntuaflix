const { query } = require('express');
const { pool } = require('../utils/database');


exports.getSample = (req, res, next) => {
    res.status(200).json({ message: 'Hello World!' });
}

exports.getMovies = async (req, res, next) => {
    const query = `SELECT * FROM Titles WHERE titletype = 'movie'`;

    try {
        const [rows] = await pool.query(query);
        res.status(200).json(rows);
    } catch (err) {
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getMovieById = async (req, res, next) => {
    const id = req.params.id;
    const query = `SELECT * FROM Titles WHERE tconst = '${id}'`;

    try {
        const [rows] = await pool.query(query);
        res.status(200).json(rows);
    } catch (err) {
        res.status(500).json({ message: 'Internal server error' });
    }
};


exports.getAllInfoForMovieById = async (req, res, next) => {
    const titleID = req.params.titleID;


    const query = `
    
    
    SELECT 
    T.tconst AS titleID,
    T.titletype AS type,
    T.originaltitle AS originalTitle,
    T.img_url_asset AS titlePoster,
    T.startYear,
    T.endYear,
    G.genres,
    JSON_OBJECT('avRating', TR.averageRate, 'nVotes', TR.numVotes) AS rating,
    TA.titleAkas,
    TP.principals
FROM ntuaflix.Titles T
LEFT JOIN (
    SELECT 
        tconst,
        JSON_ARRAYAGG(JSON_OBJECT('genreTitle', genre)) AS genres
    FROM (
        SELECT DISTINCT 
            tconst, 
            TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(T.genres, ',', numbers.n), ',', -1)) AS genre
        FROM ntuaflix.Titles T
        CROSS JOIN (
            SELECT 1 n UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5
        ) AS numbers
        WHERE CHAR_LENGTH(T.genres) - CHAR_LENGTH(REPLACE(T.genres, ',', '')) >= numbers.n - 1
    ) AS unique_genres
    GROUP BY tconst
) G ON T.tconst = G.tconst
LEFT JOIN ntuaflix.Title_ratings TR ON T.tconst = TR.titleid
LEFT JOIN (
    SELECT 
        tconst, 
        JSON_ARRAYAGG(JSON_OBJECT('akaTitle', title, 'regionAbbrev', region)) AS titleAkas
    FROM (
        SELECT DISTINCT 
            tconst, 
            title, 
            region
        FROM ntuaflix.title_akas
    ) AS distinct_akas
    GROUP BY tconst
) TA ON T.tconst = TA.tconst
LEFT JOIN (
    SELECT 
        tconst, 
        JSON_ARRAYAGG(JSON_OBJECT('nameID', nconst, 'name', primaryName, 'category', category)) AS principals
    FROM (
        SELECT DISTINCT 
            TP.tconst, 
            TP.nconst, 
            P.primaryName, 
            TP.category
        FROM ntuaflix.title_principals TP
        JOIN ntuaflix.people P ON TP.nconst = P.nconst
    ) AS distinct_principals
    GROUP BY tconst
) TP ON T.tconst = TP.tconst
WHERE T.tconst = '${titleID}'
GROUP BY T.tconst;


    
    `;

    
    try {
        const [rows] = await pool.query(query);
        res.status(200).json(rows);
    } catch (err) {
        res.status(500).json({ message: 'Internal server error' });
    }
}

exports.getPrimaryTitle = async (req, res, next) => {
    const titlePart = req.body.titlePart;
    if (!titlePart) {
        return res.status(400).json({ message: 'No title part provided' });
    }

    const query = 'SELECT * FROM ntuaflix.titles WHERE primarytitle LIKE ?';
    const values = [`%${titlePart}%`];

    try {
        const [rows] = await pool.query(query, values);
        res.status(200).json(rows);
    } catch (err) {
        res.status(500).json({ message: 'Error connecting to database' });
    }
};


exports.getGenre = async (req,res,next)=>{

    const qgenre = req.body.qgenre;
    const minrating = req.body.minrating;
    const yrFrom = req.body.yrFrom;
    const yrTo = req.body.yrTo;

    
    /* 
    if (!qgenre || !minrating) {
        return res.status(400).json({ message: 'No genre or minrating given' });
    }
    afto edw to afinw ws minima giati an den valoume genre mporoume na xrisimopoiisoume
    afto to endpoint gia perissoteres xrisis, stin ousia na min perioristoume
    
    // */

    const query = `
    SELECT Titles.tconst, Titles.primarytitle, Titles.startYear, Titles.genres, Title_ratings.averageRate
    FROM Titles
    INNER JOIN Title_ratings ON Titles.tconst = Title_ratings.titleid
    WHERE Titles.genres LIKE CONCAT('%', '${qgenre}', '%')
    AND CAST(Title_ratings.averageRate AS DECIMAL(3, 2)) >= CAST('${minrating}' AS DECIMAL(3, 2))
    AND ( '${yrFrom}' = '' OR CAST(Titles.startYear AS UNSIGNED) >= CAST('${yrFrom}' AS UNSIGNED) )
    AND ( '${yrTo}' = '' OR CAST(Titles.startYear AS UNSIGNED) <= CAST('${yrTo}' AS UNSIGNED) );
    `;
    

    try {
        const [rows] = await pool.query(query);
        res.status(200).json(rows);
    } catch (err) {
        res.status(500).json({ message: 'Internal server error' });
    }

}

exports.getSearchName = (req,res,next)=>{
    
}
 