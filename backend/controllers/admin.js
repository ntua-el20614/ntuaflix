
const { write } = require('fs');
const { pool } = require('../utils/database');
const fs = require('fs').promises;
const Papa = require('papaparse');

const util = require('util');

const readFile = util.promisify(fs.readFile);


exports.getHealth = async (req, res, next) => {
    try {
        // Using promise-based query
        const [results] = await pool.query('SELECT 1');

        res.json({ status: "OK", dataconnection: "Database connection is successful" });
    } catch (error) {
        res.status(500).json({ status: "failed", dataconnection: error.message });
    }
};


exports.uploadTitleBasics = async (req, res, next) => {

    if (!req.files || !req.files.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    try {
        const filePath = req.files.file[0].path;
        const data = await fs.readFile(filePath, 'utf8');


        Papa.parse(data, {
            header: true,
            delimiter: '\t',
            complete: async (results) => {
                try {
                    for (const row of results.data) {
                        let { tconst, titleType, primaryTitle, originalTitle, isAdult, startYear, endYear, runtimeMinutes, genres, img_url_asset } = row;
                        row.isAdult = row.isAdult === 'TRUE' ? '1' : '0';
                        isAdult = row.isAdult;

                        if (!tconst || tconst == '\n') {
                            continue;
                        }

                        const query = `
                        INSERT INTO Titles (tconst, titletype, primarytitle, originaltitle, isAdult, startYear, endYear, runtimeMinutes, genres, img_url_asset)
                        VALUES (?,?,?,?,?,?,?,?,?,?)
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
                        await pool.query(query, [tconst, titleType, primaryTitle, originalTitle, isAdult, startYear, endYear, runtimeMinutes, genres, img_url_asset]);


                    }
                    res.status(200).json({ message: 'File processed successfully' });
                } catch (err) {
                    res.status(500).json({ error: err.message });
                }
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};





exports.uploadTitleAkas = async (req, res, next) => {
    if (!req.files || !req.files.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    try {
        const filePath = req.files.file[0].path;
        const data = await fs.readFile(filePath, 'utf8');


        Papa.parse(data, {
            header: true,
            delimiter: '\t',
            complete: async (results) => {
                try {
                    for (const row of results.data) {
                        const { titleId, ordering, title, region, language, types, attributes, isOriginalTitle } = row;

                        if (!titleId || titleId == '\n' || !ordering || ordering == '\n') {//an i grammi einai adeia (2 teleftea enter px)
                            continue;
                        }
                        const query = `
                        INSERT INTO title_akas (tconst, ordering, title, region, language, types, attributes, isOriginalTitle)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                        ON DUPLICATE KEY UPDATE
                            title = VALUES(title),
                            region = VALUES(region),
                            language = VALUES(language),
                            types = VALUES(types),
                            attributes = VALUES(attributes),
                            isOriginalTitle = VALUES(isOriginalTitle);
                    `;
                        await pool.query(query, [titleId, ordering, title, region, language, types, attributes, isOriginalTitle]);
                    }
                    res.status(200).json({ message: 'File processed successfully' });
                } catch (err) {
                    res.status(500).json({ error: err.message });
                }
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};




exports.uploadNameBasics = async (req, res, next) => {
    if (!req.files || !req.files.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    try {
        const filePath = req.files.file[0].path;
        const data = await fs.readFile(filePath, 'utf8');

        Papa.parse(data, {
            header: true,
            delimiter: '\t',
            complete: async (results) => {
                try {
                    for (const row of results.data) {
                        const { nconst, primaryName, birthYear, deathYear, primaryProfession, knownForTitles, img_url_asset } = row;

                        if (!nconst || nconst == '\n') {
                            continue;
                        }

                        const query = `
                            INSERT INTO people (nconst, primaryName, birthYear, deathYear, primaryProfession, knownForTitles, img_url_asset)
                            VALUES (?, ?, ?, ?, ?, ?, ?)
                            ON DUPLICATE KEY UPDATE
                            primaryName = VALUES(primaryName),
                            birthYear = VALUES(birthYear),
                            deathYear = VALUES(deathYear),
                            primaryProfession = VALUES(primaryProfession),
                            knownForTitles = VALUES(knownForTitles),
                            img_url_asset = VALUES(img_url_asset);
                        `;
                        await pool.query(query, [nconst, primaryName, birthYear, deathYear, primaryProfession, knownForTitles, img_url_asset]);
                    }
                    res.status(200).json({ message: 'File processed successfully' });
                } catch (err) {
                    res.status(500).json({ error: err.message });
                }
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


exports.uploadTitleCrew = async (req, res, next) => {


    if (!req.files || !req.files.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }
    try {
        const filePath = req.files.file[0].path;
        const data = await fs.readFile(filePath, 'utf8');


        Papa.parse(data, {
            header: true,
            delimiter: '\t',
            complete: async (results) => {
                try {
                    for (const row of results.data) {
                        const { tconst, directors, writers } = row;

                        if (!tconst || tconst == '\n') {
                            continue;
                        }

                        const query = `
                        INSERT INTO title_crew (tconst, directors, writers)
                        VALUES (?, ?, ?)
                        ON DUPLICATE KEY UPDATE
                        directors = VALUES(directors),
                        writers = VALUES(writers);
                    `;
                        await pool.query(query, [tconst, directors, writers]);


                    }
                    res.status(200).json({ message: 'File processed successfully' });
                } catch (err) {
                    res.status(500).json({ error: err.message });
                }
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};



exports.uploadTitleEpisode = async (req, res, next) => {
    if (!req.files || !req.files.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }
    try {
        const filePath = req.files.file[0].path;
        const data = await fs.readFile(filePath, 'utf8');


        Papa.parse(data, {
            header: true,
            delimiter: '\t',
            complete: async (results) => {
                try {
                    for (const row of results.data) {
                        const { tconst, parentTconst, seasonN, episodeN } = row;

                        if (!tconst || tconst == '\n') {
                            continue;
                        }
                        const query = `
                        INSERT INTO episodes (tconst, parentTconst, seasonN, episodeN)
                        VALUES (?, ?, ?, ?)
                        ON DUPLICATE KEY UPDATE
                            parentTconst = VALUES(parentTconst),
                            seasonN = VALUES(seasonN),
                            episodeN = VALUES(episodeN);
                    `;
                        await pool.query(query, [tconst, parentTconst, seasonN, episodeN]);


                    }
                    res.status(200).json({ message: 'File processed successfully' });
                } catch (err) {
                    res.status(500).json({ error: err.message });
                }
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};




exports.uploadTitlePrincipals = async (req, res, next) => {


    if (!req.files || !req.files.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }



    try {
        const filePath = req.files.file[0].path;
        const data = await fs.readFile(filePath, 'utf8');

        Papa.parse(data, {
            header: true,
            delimiter: '\t',
            complete: async (results) => {
                try {
                    for (const row of results.data) {
                        const { tconst, ordering, nconst, category, job, characters, img_url_asset } = row;

                        if (!tconst || tconst == '\n' || !ordering || ordering == '\n') {//an i grammi einai adeia (2 teleftea enter px)
                            continue;
                        }
                        const query = `
                        INSERT INTO title_principals (tconst, ordering, nconst, category, job, characters, img_url_asset)
                        VALUES (?, ?, ?, ?, ?, ?, ?)
                        ON DUPLICATE KEY UPDATE
                        nconst = VALUES(nconst),
                        category = VALUES(category),
                        job = VALUES(job),
                        characters = VALUES(characters),
                        img_url_asset = VALUES(img_url_asset);
                    `;
                        await pool.query(query, [tconst, ordering, nconst, category, job, characters, img_url_asset]);
                    }
                    res.status(200).json({ message: 'File processed successfully' });
                } catch (err) {
                    res.status(500).json({ error: err.message });
                }
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


exports.uploadTitleRatings = async (req, res, next) => {

    if (!req.files || !req.files.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }
    try {
        const filePath = req.files.file[0].path;
        const data = await fs.readFile(filePath, 'utf8');


        Papa.parse(data, {
            header: true,
            delimiter: '\t',
            complete: async (results) => {
                try {
                    for (const row of results.data) {
                        //console.log(row)
                        const { tconst, averageRating, numVotes } = row;

                        if (!tconst || tconst == '\n') {
                            continue;
                        }

                        const query = `
                        INSERT INTO title_ratings (titleid, averageRate, numVotes)
                        VALUES (?, ?, ?)
                        ON DUPLICATE KEY UPDATE
                        averageRate = VALUES(averageRate),
                        numVotes = VALUES(numVotes);
                    `;



                        await pool.query(query, [tconst, averageRating, numVotes]);


                    }
                    res.status(200).json({ message: 'File processed successfully' });
                } catch (err) {
                    res.status(500).json({ error: err.message });
                }
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};




exports.chUser = async (req, res, next) => {

    const username = req.params.username;
    const password = req.params.password; // Ensure this is hashed if needed

    const query = `
    INSERT INTO ntuaflix.users (username, password_hashed)
    VALUES (?, ?) AS new_values
    ON DUPLICATE KEY UPDATE password_hashed = new_values.password_hashed;
     `;
    try {
        const [results] = await pool.query(query, [username, password]);
        res.status(200).json({ message: 'Operation successful', new_password: `${password}`, data: results });
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
}


exports.getUser = async (req, res, next) => {

    const username = req.params.username;
    const query = `SELECT * FROM users WHERE username = ?`;

    try {
        const [results] = await pool.query(query, [username]);
        res.status(200).json({ message: 'Operation successful', new_password: `${password}`, data: results });
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
}

exports.getTest = async (req, res, next) => {
    try {
        const [results] = await pool.query('SELECT 1');
        res.status(200).json({ status: "success" });
    } catch (err) {
        res.status(500).json({ status: "failed" });
    }
}