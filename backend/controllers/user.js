// controllers/user.js
const { pool } = require('../utils/database');

exports.check_rating = async (req, res) => {
    const userid = req.params.userid;
    const tconst = req.params.tconst;

    const query = `SELECT rating FROM user_rate WHERE userid = ${userid} AND tconst = '${tconst}';`



    try {
        const [rows] = await pool.query(query);

        res.status(200).json([rows[0]] || []);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }

};

exports.update_rating = async (req, res, next) => {
    let { userid, tconst, rating } = req.params;


    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
        // Check if tconst exists in Titles table
        let query = `SELECT tconst FROM Titles WHERE tconst = ?;`;
        const [titleExists] = await connection.query(query, [tconst]);
        if (titleExists.length === 0) {
            // tconst does not exist in Titles, cannot proceed
            await connection.rollback(); // Not strictly necessary here but good practice
            connection.release();
            return res.status(400).json({ message: "Invalid tconst: Title does not exist." });
        }

        // Check if the user has already rated this title
        query = `SELECT rating FROM user_rate WHERE userID = ? AND tconst = ?;`;
        const [existingRating] = await connection.query(query, [userid, tconst]);
        const isUpdate = existingRating.length > 0;

        // Insert or update user rating
        query = `
            INSERT INTO user_rate (userID, tconst, rating)
            VALUES (?, ?, ?)
            ON DUPLICATE KEY UPDATE rating = VALUES(rating);
        `;
        await connection.query(query, [userid, tconst, rating]);

        // Calculate new average rating without increasing numVotes if it's an update
        let newAverage, newNumVotes;
        query = `SELECT averageRate, numVotes FROM Title_ratings WHERE titleid = ?;`;
        const [ratingInfo] = await connection.query(query, [tconst]);
        if (ratingInfo.length > 0) {
            let { averageRate, numVotes } = ratingInfo[0];
            averageRate = parseFloat(averageRate);
            numVotes = parseInt(numVotes, 10);
            rating = parseInt(rating, 10);

            
            if (isUpdate) {

                newAverage = (((averageRate * numVotes) - existingRating[0].rating + rating) / numVotes);
                newNumVotes = numVotes; // Keep numVotes unchanged
                newAverage = parseFloat(newAverage.toFixed(2));

            } else {
                // This is a new rating, increment numVotes
                newNumVotes = numVotes + 1;
                newAverage = ((averageRate * numVotes) + rating) / newNumVotes;
                newAverage = parseFloat(newAverage.toFixed(2));


            }
        } else {
            // This title has no ratings yet
            newAverage = rating;
            newNumVotes = 1;
        }

        // Update Title_ratings with the new average and number of votes
        query = `
            INSERT INTO Title_ratings (titleid, averageRate, numVotes)
            VALUES (?, ?, ?)
            ON DUPLICATE KEY UPDATE
                averageRate = VALUES(averageRate),
                numVotes = VALUES(numVotes);
        `;
        await connection.query(query, [tconst, newAverage, newNumVotes]);

        // Commit transaction
        await connection.commit();
        res.status(200).json({ message: 'Rating updated successfully' });
    } catch (err) {
        // Rollback transaction in case of error
        await connection.rollback();
        res.status(500).json({ message: 'Internal server error', error: err.message });
    } finally {
        // Release the connection
        connection.release();
    }
};
