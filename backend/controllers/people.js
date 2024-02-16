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

exports.getActorTitlesRolesAndCharacters = async (req, res, next) => {
    const nconst = req.params.nconst; // Extract nconst from URL parameters

    const query = `
        SELECT 
            COALESCE(ep.parentTconst, tp.tconst) AS movieID,
            GROUP_CONCAT(DISTINCT 
                CASE 
                    WHEN tp.category IN ('actor', 'actress') THEN tp.characters
                    ELSE tp.category
                END ORDER BY CASE WHEN tp.category IN ('actor', 'actress') THEN 1 ELSE 2 END
            ) AS roles,
            COUNT(DISTINCT CASE WHEN ep.tconst IS NOT NULL THEN ep.tconst ELSE NULL END) AS count
        FROM 
            title_principals AS tp
        LEFT JOIN
            Episodes AS ep ON tp.tconst = ep.tconst
        LEFT JOIN
            people AS p ON tp.nconst = p.nconst
        WHERE 
            tp.nconst = ?
            AND NOT EXISTS (
                SELECT 1 FROM Titles WHERE FIND_IN_SET(tp.tconst, p.knownForTitles) AND p.nconst = ?
            )
        GROUP BY
            COALESCE(ep.parentTconst, tp.tconst)
        ORDER BY
            movieID
    `;

    try {
        const [rows] = await pool.query(query, [nconst, nconst]);
        res.status(200).json(rows);
    } catch (err) {
        console.error('Error fetching actor titles, roles, and characters:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};




exports.getTopTenPeople = async (req,res,next)=>{

    const query = `
    
    SELECT p.nconst, p.img_url_asset, p.primaryName, p.primaryProfession, AVG(tr.averageRate) AS avgRating
FROM people p
JOIN title_principals tp ON p.nconst = tp.nconst
JOIN title_ratings tr ON tp.tconst = tr.titleid
WHERE p.primaryName IN (
    'Steven Spielberg', 'Meryl Streep', 'Leonardo DiCaprio', 'Oprah Winfrey', 'Tom Hanks', 
    'Angelina Jolie', 'Brad Pitt', 'Quentin Tarantino', 'George Clooney', 'Scarlett Johansson', 
    'Morgan Freeman', 'Cate Blanchett', 'Johnny Depp', 'Denzel Washington', 'Nicole Kidman', 
    'Robert De Niro', 'Kate Winslet', 'Christopher Nolan', 'Hugh Jackman', 'Natalie Portman', 
    'Daniel Day-Lewis', 'Matt Damon', 'Julia Roberts', 'Jennifer Lawrence', 'Clint Eastwood', 
    'Bradley Cooper', 'Anne Hathaway', 'Ryan Gosling', 'Margot Robbie', 'Al Pacino', 
    'Sandra Bullock', 'Tom Cruise', 'Emma Stone', 'Charlize Theron', 'Will Smith', 
    'Amy Adams', 'Dwayne Johnson', 'James Cameron', 'Gal Gadot', 'Joaquin Phoenix', 
    'Samuel L. Jackson', 'Jake Gyllenhaal', 'Ryan Reynolds', 'Christian Bale', 'Rachel McAdams', 
    'Chris Hemsworth', 'Michael Fassbender', 'Emma Watson', 'Ben Affleck', 'Mark Ruffalo', 
    'Robert Downey Jr.', 'Sofia Vergara', 'Chris Pratt', 'Benedict Cumberbatch', 'Emily Blunt', 
    'Tom Hiddleston', 'Keira Knightley', 'Chadwick Boseman', 'Brie Larson', 'Jason Momoa', 
    'Henry Cavill', 'Zoe Saldana', 'Chris Evans', 'Daniel Craig', 'Idris Elba', 
    'Jennifer Aniston', 'Adam Sandler', 'Scarlett Johansson', 'Halle Berry', 'Sean Connery', 
    'Bruce Willis', 'Arnold Schwarzenegger', 'Sylvester Stallone', 'Keanu Reeves', 'Jack Nicholson', 
    'Robin Williams', 'Jim Carrey', 'Eddie Murphy', 'Tommy Lee Jones', 'Cameron Diaz', 
    'Harrison Ford', 'Mel Gibson', 'Sigourney Weaver', 'Bill Murray', 'John Travolta', 
    'Liam Neeson', 'Jean-Claude Van Damme', 'Kurt Russell', 'Wesley Snipes', 'Nicolas Cage', 
    'John Goodman', 'Jeff Bridges', 'Kevin Costner', 'Danny DeVito', 'Dustin Hoffman', 
    'Michael Keaton', 'Steve Martin', 'Tim Robbins', 'Billy Crystal', 'Woody Harrelson', 
    'Matthew McConaughey', 'Viggo Mortensen', 'Javier Bardem', 'Jeff Goldblum', 'Edward Norton', 
    'Philip Seymour Hoffman', 'Willem Dafoe', 'Ben Kingsley', 'Ian McKellen', 'Patrick Stewart', 
    'Gary Oldman', 'Ralph Fiennes', 'Anthony Hopkins', 'Jeremy Irons', 'Michael Caine', 
    'Maggie Smith', 'Helen Mirren', 'Judi Dench', 'Julie Andrews', 'Glenn Close', 
    'Susan Sarandon', 'Jessica Lange', 'Sally Field', 'Diane Keaton', 'Jane Fonda', 
    'Kathy Bates', 'Annette Bening', 'Michelle Pfeiffer', 'Sigourney Weaver', 'Julianne Moore', 
    'Frances McDormand', 'Tilda Swinton', 'Marion Cotillard', 'Penélope Cruz', 'Kate Winslet', 
    'Charlize Theron', 'Naomi Watts', 'Natalie Portman', 'Jennifer Lawrence', 'Emma Stone', 
    'Lupita Nyong\’o', 'Alicia Vikander', 'Reese Witherspoon', 'Saoirse Ronan', 'Julia Louis-Dreyfus', 
    'Viola Davis', 'Gwyneth Paltrow', 'Drew Barrymore', 'Mila Kunis', 'Kristen Stewart', 
    'Zoe Kravitz', 'Elisabeth Moss', 'Rachel Weisz', 'Dakota Johnson', 'Salma Hayek', 
    'Daisy Ridley', 'Rosamund Pike', 'Felicity Jones', 'Olivia Colman', 'Gemma Arterton', 
    'Carey Mulligan', 'Emily Ratajkowski', 'Rooney Mara', 'Evangeline Lilly', 'Bryce Dallas Howard', 
    'Hayley Atwell', 'Jessica Chastain', 'Michelle Rodriguez', 'Elizabeth Olsen', 'Priyanka Chopra', 
    'Emilia Clarke', 'Shailene Woodley', 'Kate Beckinsale', 'Lily James', 'Mindy Kaling', 
    'Zendaya', 'Bella Thorne', 'Anna Kendrick', 'Aubrey Plaza', 'Ellen Page', 
    'Vanessa Hudgens', 'Melissa McCarthy', 'Kristen Wiig', 'Maya Rudolph', 'Tina Fey', 
    'Amy Poehler', 'Leslie Mann', 'Catherine Zeta-Jones', 'Jodie Foster', 'Sharon Stone'
)

AND p.img_url_asset IS NOT NULL 
AND p.img_url_asset != '\\\\N' 
AND p.img_url_asset != ''
GROUP BY p.nconst, p.primaryName
ORDER BY p.img_url_asset DESC;

    `;
    
    try {
        const [rows] = await pool.query(query);
        res.status(200).json(rows);
    } catch (err) {
        res.status(500).json({ message: 'Internal server error' });
    }

}