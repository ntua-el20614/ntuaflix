#!/usr/bin/env node

const { program } = require('commander');
const axios = require('axios');
const fs = require('fs');

program.version('1.0.0');

// healthcheck
program
    .command('healthcheck')
    .description('Perform a health check of the ntuaflix API')
    .action(healthcheck);

async function healthcheck() {
    try {
        const response = await axios.get('http://localhost:7117/admin/healthcheck');
        
        // Save the response data to a JSON file
        fs.writeFile('healthcheck.json', JSON.stringify(response.data, null, 2), (err) => {
            if (err) {
                console.error('Error writing file:', err);
            } else {
                console.log('Health check data saved to healthcheck.json');
            }
        });
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

program.parse(process.argv);
