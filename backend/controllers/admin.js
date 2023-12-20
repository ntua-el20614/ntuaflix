const { Console } = require('console');
const { pool } = require('../utils/database');
const fs = require('fs');
const Papa = require('papaparse');


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



exports.uploadTitleBasics = (req, res, next) => {

    if (!req.files || !req.files.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }
    const filePath = req.files.file[0].path;
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Error reading file' });
        }

        Papa.parse(data, {
            header: true,
            delimiter: '\t',
            complete: (results) => {
                // Process each row of the TSV data
                results.data.forEach(row => {
                    let { tconst, titleType, primaryTitle, originalTitle, isAdult, startYear, endYear, runtimeMinutes, genres, img_url_asset } = row;
                    row.isAdult = row.isAdult === 'TRUE' ? '1' : '0';
                    isAdult = row.isAdult;

                    const query = `
                        INSERT INTO Titles (tconst, titletype, primarytitle, originaltitle, isAdult, startYear, endYear, runtimeMinutes, genres, img_url_asset)
                        VALUES ('${tconst}', '${titleType}', '${primaryTitle}','${originalTitle}','${isAdult}','${startYear}','${endYear}','${runtimeMinutes}','${genres}','${img_url_asset}')
                        ON DUPLICATE KEY UPDATE
                            titletype = VALUES(titletype),
                            primarytitle = VALUES(primarytitle),
                            originaltitle = VALUES(originaltitle),
                            isAdult = VALUES(isAdult),
                            startYear = VALUES(startYear),
                            endYear = VALUES(endYear),
                            runtimeMinutes = VALUES(runtimeMinutes),
                            genres = VALUES(genres),
                            img_url_asset = VALUES(img_url_asset);
                    `;

                    pool.query(query, (err, results) => {
                        if (err) {
                            console.log("error with database")

                        }

                    });
                });

                res.status(200).json({ message: 'File processed successfully' });
            }
        });
    });
};

exports.uploadTitleAkas = (req, res, next) => {


    if (!req.files || !req.files.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }
    const filePath = req.files.file[0].path;
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Error reading file' });
        }

        Papa.parse(data, {
            header: true,
            delimiter: '\t',
            complete: (results) => {
                // Process each row of the TSV data
                results.data.forEach(row => {
                    const { titleId, ordering, title, region, language, types, attributes, isOriginalTitle } = row;

                    const query = `
                        INSERT INTO title_akas (tconst, ordering, title, region, language, types, attributes, isOriginalTitle)
                        VALUES ('${titleId}', '${ordering}', '${title}','${region}','${language}','${types}','${attributes}','${isOriginalTitle}')
                        ON DUPLICATE KEY UPDATE
                            title = VALUES(title),
                            region = VALUES(region),
                            language = VALUES(language),
                            types = VALUES(types),
                            attributes = VALUES(attributes),
                            isOriginalTitle = VALUES(isOriginalTitle);
                    `;
                    
                    

                    pool.query(query, (err, results) => {
                        if (err) {

                        }

                    });
                });
                res.status(200).json({ message: 'File processed successfully' });

            }
        });
    });
}

exports.uploadNameBasics = (req, res, next) => {
    


    if (!req.files || !req.files.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }
    const filePath = req.files.file[0].path;
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Error reading file' });
        }

        Papa.parse(data, {
            header: true,
            delimiter: '\t',
            complete: (results) => {
                // Process each row of the TSV data
                results.data.forEach(row => {
                    const {nconst, primaryName, birthYear, deathYear, primaryProfession, knownForTitles, img_url_asset} = row;

                    const query = `
                        INSERT INTO people (nconst, primaryName, birthYear, deathYear, primaryProfession, knownForTitles, img_url_asset)
                        VALUES ('${nconst}', '${primaryName}', '${birthYear}','${deathYear}','${primaryProfession}','${knownForTitles}','${img_url_asset}')
                        ON DUPLICATE KEY UPDATE
                        primaryName = VALUES(primaryName),
                        birthYear = VALUES(birthYear),
                        deathYear = VALUES(deathYear),
                        primaryProfession = VALUES(primaryProfession),
                        knownForTitles = VALUES(knownForTitles),
                        img_url_asset = VALUES(img_url_asset);
                    `;
                    
                    

                    pool.query(query, (err, results) => {
                        if (err) { 

                        }

                    });
                });
                res.status(200).json({ message: 'File processed successfully' });

            }
        });
    });
}

exports.uploadTitleCrew = (req, res, next) => {
}

exports.uploadTitleEpisode = (req, res, next) => {
}

exports.uploadTitlePrincipals = (req, res, next) => {
}

exports.uploadTitleRatings = (req, res, next) => {

    pool.getConnection((err, connection) => {
        if (err) {
            return res.status(500).json({ message: 'Error connecting to the database' });
        }

        const query = ``;

        connection.query(query, (err, results) => {
            connection.release();
            if (err) {
                return res.status(500).json({ message: 'Internal server error' });
            }

            return res.status(200).json({ message: 'Insert Successfull' });
        });
    });

}



exports.chUser = (req, res, next) => {

    const username = req.params.username;
    const password = req.params.password; // Ensure this is hashed if needed

    const query = `
    INSERT INTO ntuaflix.users (username, password_hashed)
    VALUES ('${username}', '${password}') AS new_values
    ON DUPLICATE KEY UPDATE password_hashed = new_values.password_hashed;
     `;
    pool.getConnection((err, connection) => {
        if (err) {
            return res.status(500).json({ message: 'Error connecting to the database' });
        }

        connection.query(query, [username, password], (err, results) => {
            connection.release();
            if (err) {
                return res.status(500).json({ message: 'Internal server error' });
            }

            return res.status(200).json({ message: 'Operation successful', new_password: `${password}`, data: results });
        });
    });
}


exports.getUser = (req, res, next) => {

    const username = req.params.username;
    const query = `SELECT * FROM users WHERE username = '${username}'`;

    pool.getConnection((err, connection) => {
        connection.query(query, (err, rows) => {
            connection.release();
            if (err) return res.status(500).json({ message: 'Internal server error' });

            return res.status(200).json(rows);
        });
    });

}

exports.getTest = (req, res, next) => {

    res.status(200).json({ status: "success" });
}