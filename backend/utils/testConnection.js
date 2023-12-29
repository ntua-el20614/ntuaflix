const mysql = require('mysql2/promise');

async function testConnection() {
    try {
        const pool = mysql.createPool({
            host: 'localhost',
            user: 'root',
            port: 3306,
            password: 'password',
            database: 'ntuaflix',
            connectionLimit: 100
        });

        const [results] = await pool.query('SELECT 1');
        console.log('Connection successful:', results);
        pool.end();
    } catch (error) {
        console.error('Connection failed:', error);
    }
}

testConnection();
