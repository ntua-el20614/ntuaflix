#!/usr/bin/env node

const { program } = require('commander');
const axios = require('axios');

program.version('1.0.0');


//healthcheck
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
