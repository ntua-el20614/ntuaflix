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
    pool.getConnection((err, connection) => {
        connection.query(query, (err, rows) => {
            connection.release();
            if (err) return res.status(500).json({ message: 'Internal server error' });

            return res.status(200).json(rows);
        });
    });

}


exports.getAllInfoForAPerson = (req, res, next) => {
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

    pool.getConnection((err, connection) => {
        if (err) {
            return res.status(500).json({ message: 'Error connecting to database' });
        }
        connection.query(query, (err, rows) => {
            connection.release();
            if (err) {
                return res.status(500).json({ message: 'Internal server error' });
            }
            return res.status(200).json(rows);
        });
    });

}