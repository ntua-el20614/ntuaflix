#!/usr/bin/env node

const { program } = require('commander');
const axios = require('axios');

program.version('1.0.0');

// Example command to list all titles
program
    .command('list-titles')
    .description('List all movie titles')
    .action(listTitles);

async function listTitles() {
    try {
        const response = await axios.get('http://localhost:7117/ntuaflix_api/people');
        console.log(response.data);
    } catch (error) {
        console.error('Error fetching titles:', error);
    }
}

program
    .command('healthcheck')
    .description('Perform a health check of the ntuaflix API')
    .action(healthcheck);

async function healthcheck() {
    try {
        const response = await axios.get('http://localhost:7117/admin/healthcheck');
        console.log(response.data);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

program.parse(process.argv);
