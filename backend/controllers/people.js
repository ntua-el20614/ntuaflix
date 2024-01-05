const { pool } = require('../utils/database');


exports.getPeople = async (req, res, next) => {

    const query = `SELECT * FROM People`;


    try {
        const [rows] = await pool.query(query);
        res.status(200).json(rows);
    } catch (err) {
        res.status(500).json({ message: 'Internal server error' });
    }

}


exports.getTypeOfPeople = async (req, res, next) => {
    const profession = req.params.profession;

    const query = `SELECT * FROM people WHERE primaryProfession LIKE "%${profession}%"`;


    try {
        const [rows] = await pool.query(query);
        res.status(200).json(rows);
    } catch (err) {
        res.status(500).json({ message: 'Internal server error' });
    }

}


exports.getTypeOfPeopleOneProfession = async (req, res, next) => {
    const profession = req.params.profession;

    const query = `SELECT * FROM people WHERE primaryProfession LIKE "${profession}"`;


    try {
        const [rows] = await pool.query(query);
        res.status(200).json(rows);
    } catch (err) {
        res.status(500).json({ message: 'Internal server error' });
    }

}

exports.getOnePerson = async (req, res, next) => { 

    const nameID = req.params.nameID;

    const query = `SELECT * FROM people WHERE nconst = "${nameID}"`;
    
    try {
        const [rows] = await pool.query(query);
        res.status(200).json(rows);
    } catch (err) {
        res.status(500).json({ message: 'Internal server error' });
    }

}

exports.getCharacter = async (req, res, next) => {
    const nameID = req.params.nameID;
    const titleID = req.params.titleID;

    const query = `SELECT * FROM title_principals WHERE nconst = "${nameID}" AND tconst = "${titleID}"`;
    
    try {
        const [rows] = await pool.query(query);
        res.status(200).json(rows);
    } catch (err) {
        res.status(500).json({ message: 'Internal server error' });
    }


}

exports.getCrew = async (req, res, next) => {
    const titleID = req.params.titleID;

    const query = `
    
SELECT 
JSON_OBJECT(
    'writer', (
        SELECT 
            JSON_ARRAYAGG(
                JSON_OBJECT(
                    'nconst', p.nconst, 
                    'primaryName', p.primaryName, 
                    'birthYear', p.birthYear, 
                    'deathYear', p.deathYear, 
                    'primaryProfession', p.primaryProfession, 
                    'knownForTitles', p.knownForTitles,
                    'img_url_asset', p.img_url_asset
                )
            )
        FROM title_crew tc
        JOIN people p ON FIND_IN_SET(p.nconst, tc.writers)
        WHERE tc.tconst = ?
    ),
    'director', (
        SELECT 
            JSON_ARRAYAGG(
                JSON_OBJECT(
                    'nconst', p.nconst, 
                    'primaryName', p.primaryName, 
                    'birthYear', p.birthYear, 
                    'deathYear', p.deathYear, 
                    'primaryProfession', p.primaryProfession, 
                    'knownForTitles', p.knownForTitles,
                    'img_url_asset', p.img_url_asset
                )
            )
        FROM title_crew tc
        JOIN people p ON FIND_IN_SET(p.nconst, tc.directors)
        WHERE tc.tconst = ?
    )
) AS result
FROM DUAL;

    `;
    
    try {
        const [rows] = await pool.query(query,[titleID,titleID]);
        res.status(200).json(rows);
    } catch (err) {
        res.status(500).json({ message: 'Internal server error' });
    

}}

exports.getAllInfoForAPerson = async (req, res, next) => {
    const nameID = req.params.nameID;


    const query = `
        SELECT 
            p.nconst AS nameID,
            p.primaryName AS name,
            p.img_url_asset AS namePoster,
            p.birthYear AS birthYr,
            p.deathYear AS deathYr,
            p.primaryProfession AS profession,
            JSON_ARRAYAGG(
                JSON_OBJECT(
                    'titleID', tp.tconst,
                    'category', tp.category
                )
            ) AS nameTitles
        FROM 
            people p
        JOIN 
            title_principals tp ON p.nconst = tp.nconst
        WHERE 
            p.nconst = '${nameID}'
        GROUP BY 
            p.nconst;
    `;

    
    try {
        const [rows] = await pool.query(query);
        res.status(200).json(rows);
    } catch (err) {
        res.status(500).json({ message: 'Internal server error' });
    }

}


exports.getSearchName = async (req, res, next) => {
    const namePart = req.body.namePart;
    if (!namePart) {
        return res.status(400).json({ message: 'No name part provided' });
    }
    
    const query =   `SELECT *
                        FROM people
                    WHERE primaryName LIKE ?;
                    `;
    const values = [`%${namePart}%`];
    
    try {
        const [rows] = await pool.query(query, values);
        res.status(200).json(rows);
    } catch (err) {
        res.status(500).json({ message: 'Error connecting to database' });
    }
}

exports.getTopTenPeople = async (req,res,next)=>{

    const query = `
    SELECT p.nconst, p.img_url_asset , p.primaryName, p.primaryProfession, AVG(tr.averageRate) AS avgRating
    FROM people p
    JOIN title_principals tp ON p.nconst = tp.nconst
    JOIN title_ratings tr ON tp.tconst = tr.titleid
    where p.img_url_asset is not null and p.img_url_asset != '\\\\N' and p.img_url_asset != ''
    GROUP BY p.nconst, p.primaryName
    ORDER BY avgRating DESC
    LIMIT 55;
    `;
    
    try {
        const [rows] = await pool.query(query);
        res.status(200).json(rows);
    } catch (err) {
        res.status(500).json({ message: 'Internal server error' });
    }

}