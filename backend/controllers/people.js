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
    where p.img_url_asset is not null
    GROUP BY p.nconst, p.primaryName
    ORDER BY avgRating DESC
    LIMIT 10;
    `;
    
    try {
        const [rows] = await pool.query(query);
        res.status(200).json(rows);
    } catch (err) {
        res.status(500).json({ message: 'Internal server error' });
    }

}