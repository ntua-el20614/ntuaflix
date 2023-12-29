#!/usr/bin/env node

const { program } = require('commander');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

program.version('1.0.0');

// healthcheck
program
    .command('healthcheck')
    .description('Perform a health check of the ntuaflix API')
    .action(healthcheck);

async function healthcheck() {
    try {
        const response = await axios.get('http://localhost:7117/admin/healthcheck');
        
        // Directory where the file will be saved
        const dir = './cli_responses';

        // Create the directory if it doesn't exist
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir);
        }

        // Path for the new file
        const filePath = path.join(dir, 'healthcheck.json');

        // Save the response data to a JSON file
        fs.writeFile(filePath, JSON.stringify(response.data, null, 2), (err) => {
            if (err) {
                console.error('Error writing file:', err);
            } else {
                console.log('Health check data saved to ' + filePath);
            }
        });
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

program.parse(process.argv);
