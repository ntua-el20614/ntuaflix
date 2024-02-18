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

exports.getGenres = async (req, res, next) => {
    const query = `
    SELECT DISTINCT 
    TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(Titles.genres, ',', numbers.n), ',', -1)) AS single_genre
FROM Titles
JOIN (
    SELECT 1 AS n UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5
    -- Extend this series as needed
) AS numbers
ON CHAR_LENGTH(Titles.genres) - CHAR_LENGTH(REPLACE(Titles.genres, ',', '')) >= numbers.n - 1
WHERE TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(Titles.genres, ',', numbers.n), ',', -1)) <> '\\\\N'
ORDER BY single_genre;

        `;

    try {
        const [rows] = await pool.query(query);
        const genres = rows.map(row => row.single_genre).filter((value, index, self) => self.indexOf(value) === index);
        res.status(200).json(genres);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error', error: err.message });
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

exports.searchTitles = async (req, res, next) => {

    const titlePart = req.body.titlePart || '';
    const qgenre = req.body.qgenre || '';
    const minrating = req.body.minrating || '0';
    const maxrating = req.body.maxrating || '10';
    const yrFrom = req.body.yrFrom || '0000';
    const yrTo = req.body.yrTo || '9999';
    const type = req.body.type || 'all';

    const query = `
    SELECT 
    Titles.*,
    Title_ratings.*,
    IF(Titles.img_url_asset LIKE '%.jpg', 0, 1) AS ImagePresent
    FROM 
    Titles
INNER JOIN 
    Title_ratings 
ON 
    Titles.tconst = Title_ratings.titleid
WHERE 
    ('${titlePart}' = '' OR Titles.primarytitle LIKE CONCAT('%', '${titlePart}', '%'))
AND 
    ('${qgenre}' = '' OR Titles.genres LIKE CONCAT('%', '${qgenre}', '%'))
AND 
    CAST(Title_ratings.averageRate AS DECIMAL(3, 2)) >= IF('${minrating}' = '', 1, CAST('${minrating}' AS DECIMAL(3, 2)))
AND 
    CAST(Title_ratings.averageRate AS DECIMAL(3, 2)) <= IF('${maxrating}' = '', 10, CAST('${maxrating}' AS DECIMAL(3, 2)))
AND 
    ( '${yrFrom}' = '' OR CAST(Titles.startYear AS UNSIGNED) >= CAST(IF('${yrFrom}' = '', '0000', '${yrFrom}') AS UNSIGNED) )
AND 
    ( '${yrTo}' = '' OR CAST(Titles.startYear AS UNSIGNED) <= CAST(IF('${yrTo}' = '', '9999', '${yrTo}') AS UNSIGNED) )
AND
    (
        '${type}' = 'all' AND Titles.titletype != 'tvEpisode'
        OR
        '${type}' = 'movies' AND Titles.titletype NOT IN ('tvEpisode', 'tvSeries', 'tvMiniSeries')
        OR
        '${type}' = 'tvshows' AND Titles.titletype NOT IN ('tvEpisode', 'movie', 'short')
    )
ORDER BY 
    ImagePresent,
    Title_ratings.averageRate DESC, 
    Titles.startYear DESC;

    `;


    try {
        const [rows] = await pool.query(query);
        res.status(200).json(rows);
    } catch (err) {
        res.status(500).json({ message: 'Internal server error' });
    }
};


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


exports.getGenre = async (req, res, next) => {

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

exports.getTopMovies = async (req, res, next) => {

    const query = `
    SELECT t.tconst, t.primarytitle, tr.averageRate, t.genres, t.img_url_asset, t.startYear, t.titletype
    FROM Titles t
        JOIN title_ratings tr ON t.tconst = tr.titleid
    WHERE t.img_url_asset IS NOT NULL and t.img_url_asset != '\\\\N' and t.img_url_asset != '' and t.titletype != 'tvEpisode' and (t.titletype = 'movie' or t.titletype = 'short' or t.titletype = 'tvSeries' or t.titletype = 'tvMiniSeries')
    ORDER BY tr.averageRate DESC, t.startYear DESC 
    LIMIT 100;
    `;

    try {
        const [rows] = await pool.query(query);
        res.status(200).json(rows);
    } catch (err) {
        res.status(500).json({ message: 'Internal server error' });
    }

}

exports.getEpisodes = async (req, res, next) => {
    const titleID = req.params.titleID;

    const query = `
    SELECT tconst, seasonN, episodeN
FROM Episodes
WHERE parentTconst = '${titleID}'
ORDER BY CAST(seasonN AS UNSIGNED) ASC, CAST(episodeN AS UNSIGNED) ASC;

    `;

    try {
        const [rows] = await pool.query(query);
        res.status(200).json(rows);
    } catch (err) {
        res.status(500).json({ message: 'Internal server error' });
    }

}