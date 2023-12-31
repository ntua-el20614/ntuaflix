#!/usr/bin/env node

const { program } = require('commander');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

program.version('1.0.0');

// 1 -- login

// 2 -- logout

// 3 -- adduser

// 4 -- user

// 5 -- healthcheck
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


// 6 -- resetall

// 7 -- newtitles

program
    .command('newtitles')
    .description('Upload new title basics to the ntuaflix API')
    .requiredOption('--filename <filename>', 'The filename of the title basics to upload')
    .option('--format <format>', 'Format of the file (json or csv)', 'json')
    .action(newtitles);

    async function newtitles(options) {
        try {
            const filePath = path.join(process.cwd(), 'cli_posts', options.filename);
            const formData = new FormData();
            formData.append('file', fs.createReadStream(filePath));
            formData.append('format', options.format);
    

            // Append the secretKey and is_user_admin fields
            formData.append('secretKey', '3141592653589793236264');
            formData.append('is_user_admin', 'true'); // or whatever value is appropriate
            // Additional fields like secretKey or is_user_admin should be appended here if required
    
            const response = await axios.post('http://localhost:7117/admin/upload/titlebasics', formData, {
                headers: formData.getHeaders(),
            });
    
            console.log(response.data);
        } catch (error) {
            console.error('Error uploading title basics:', error);
        }
    }
    


// 8 -- newakas

program
    .command('newakas')
    .description('Upload new title akas to the ntuaflix API')
    .requiredOption('--filename <filename>', 'The filename of the title akas to upload')
    .option('--format <format>', 'Format of the file (json or csv)', 'json')
    .action(newakas);

async function newakas(options) {
    try {
        const filePath = path.join(process.cwd(), 'cli_posts', options.filename);
        const formData = new FormData();
        formData.append('file', fs.createReadStream(filePath));
        formData.append('format', options.format);

        // Include the secretKey and is_user_admin if needed for authorization
        formData.append('secretKey', '3141592653589793236264');
        formData.append('is_user_admin', 'true');

        const response = await axios.post('http://localhost:7117/admin/upload/titleakas', formData, {
            headers: formData.getHeaders(),
        });

        console.log(response.data);
    } catch (error) {
        console.error('Error uploading title akas:', error);
    }
}


// 9 -- newnames

program
    .command('newnames')
    .description('Upload new name basics to the ntuaflix API')
    .requiredOption('--filename <filename>', 'The filename of the name basics to upload')
    .option('--format <format>', 'Format of the file (json or csv)', 'json')
    .action(newnames);

// Implementation of the newnames action function
async function newnames(options) {
    try {
        // Assuming 'cli_posts' is in the same directory as your CLI script
        const filePath = path.join(process.cwd(), 'cli_posts', options.filename);
        const formData = new FormData();
        formData.append('file', fs.createReadStream(filePath));
        formData.append('format', options.format);

        // Include secretKey and is_user_admin if needed for authorization
        formData.append('secretKey', '3141592653589793236264');
        formData.append('is_user_admin', 'true');

        const response = await axios.post('http://localhost:7117/admin/upload/namebasics', formData, {
            headers: formData.getHeaders(),
        });

        console.log(response.data);
    } catch (error) {
        console.error('Error uploading name basics:', error);
    }
}

// 10 -- newcrew

program
    .command('newcrew')
    .description('Upload new title crew to the ntuaflix API')
    .requiredOption('--filename <filename>', 'The filename of the title crew to upload')
    .option('--format <format>', 'Format of the file (json or csv)', 'json')
    .action(newcrew);

// Implementation of the newcrew action function
async function newcrew(options) {
    try {
        // Assuming 'cli_posts' is in the same directory as your CLI script
        const filePath = path.join(process.cwd(), 'cli_posts', options.filename);
        const formData = new FormData();
        formData.append('file', fs.createReadStream(filePath));
        formData.append('format', options.format);

        // Include secretKey and is_user_admin if needed for authorization
        formData.append('secretKey', '3141592653589793236264');
        formData.append('is_user_admin', 'true');

        const response = await axios.post('http://localhost:7117/admin/upload/titlecrew', formData, {
            headers: formData.getHeaders(),
        });

        console.log(response.data);
    } catch (error) {
        console.error('Error uploading title crew:', error);
    }
}

// 11 -- newepisode

program
    .command('newepisode')
    .description('Upload new title episode to the ntuaflix API')
    .requiredOption('--filename <filename>', 'The filename of the title episode to upload')
    .option('--format <format>', 'Format of the file (json or csv)', 'json')
    .action(newepisode);

// Implementation of the newepisode action function
async function newepisode(options) {
    try {
        // Assuming 'cli_posts' is in the same directory as your CLI script
        const filePath = path.join(process.cwd(), 'cli_posts', options.filename);
        const formData = new FormData();
        formData.append('file', fs.createReadStream(filePath));
        formData.append('format', options.format);

        // Include secretKey and is_user_admin if needed for authorization
        formData.append('secretKey', '3141592653589793236264');
        formData.append('is_user_admin', 'true');

        const response = await axios.post('http://localhost:7117/admin/upload/titleepisode', formData, {
            headers: formData.getHeaders(),
        });

        console.log(response.data);
    } catch (error) {
        console.error('Error uploading title episode:', error);
    }
}

// 12 -- newprincipals

program
    .command('newprincipals')
    .description('Upload new title principals to the ntuaflix API')
    .requiredOption('--filename <filename>', 'The filename of the title principals to upload')
    .option('--format <format>', 'Format of the file (json or csv)', 'json')
    .action(newprincipals);

// Implementation of the newprincipals action function
async function newprincipals(options) {
    try {
        // Assuming 'cli_posts' is in the same directory as your CLI script
        const filePath = path.join(process.cwd(), 'cli_posts', options.filename);
        const formData = new FormData();
        formData.append('file', fs.createReadStream(filePath));
        formData.append('format', options.format);

        // Include secretKey and is_user_admin if needed for authorization
        formData.append('secretKey', '3141592653589793236264');
        formData.append('is_user_admin', 'true');

        const response = await axios.post('http://localhost:7117/admin/upload/titleprincipals', formData, {
            headers: formData.getHeaders(),
        });

        console.log(response.data);
    } catch (error) {
        console.error('Error uploading title principals:', error);
    }
}

// 13 -- newratings
program
    .command('newratings')
    .description('Upload new title ratings to the ntuaflix API')
    .requiredOption('--filename <filename>', 'The filename of the ratings to upload')
    .option('--format <format>', 'Format of the file (json or csv)', 'json')
    .action(newratings);

async function newratings(options) {
    try {
        const filePath = path.join(process.cwd(), 'cli_posts', options.filename);
        const formData = new FormData();
        formData.append('file', fs.createReadStream(filePath));
        formData.append('format', options.format);


        // Append the secretKey and is_user_admin fields
        formData.append('secretKey', '3141592653589793236264');
        formData.append('is_user_admin', 'true'); // or whatever value is appropriate
        // Additional fields like secretKey or is_user_admin should be appended here if required

        const response = await axios.post('http://localhost:7117/admin/upload/titleratings', formData, {
            headers: formData.getHeaders(),
        });

        console.log(response.data);
    } catch (error) {
        console.error('Error uploading title basics:', error);
    }
}

// 14 -- title
program
    .command('title')
    .description('Fetch a title by its ID from the ntuaflix API')
    .requiredOption('--titleID <titleID>', 'The titleID of the movie or series to fetch')
    .action(getTitleById);

async function getTitleById(options) {
    try {
        const response = await axios.get('http://localhost:7117/title/:titleID', {titleID});

        // Directory where the file will be saved
        const dir = './cli_responses';

        // Create the directory if it doesn't exist
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir);
        }

        // Path for the new file
        const filePath = path.join(dir, `title_${options.titleID}.json`);

        // Save the response data to a JSON file
        fs.writeFile(filePath, JSON.stringify(response.data, null, 2), (err) => {
            if (err) {
                console.error('Error writing file:', err);
            } else {
                console.log(`Title data saved to ${filePath}`);
            }
        });
    } catch (error) {
        console.error('Error fetching title by ID:', error);
    }
}

// 15 -- searchtitle
program
    .command('searchtitle')
    .description('Search for titles in the ntuaflix database by a part of the title')
    .requiredOption('--titlepart <titlePart>', 'The part of the title to search for')
    .action(searchtitle);

async function searchtitle(options) {
    try {
        // Make the GET request to the search endpoint
        const response = await axios.get('http://localhost:7117/searchtitle', {titlePart});

        // Directory where the file will be saved
        const dir = './cli_responses';

        // Create the directory if it doesn't exist
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }

        // Path for the new file
        const filePath = path.join(dir, `title_${options.titlePart}.json`);

        // Save the response data to a JSON file
        fs.writeFile(filePath, JSON.stringify(response.data, null, 2), (err) => {
            if (err) {
                console.error('Error writing file:', err);
            } else {
                console.log(`Search results saved to ${filePath}`);
            }
        });
    } catch (error) {
        console.error('Error performing title search:', error);
    }
}

// 16 -- bygenre
program
    .command('bygenre')
    .description('Search for titles in the ntuaflix database by genre')
    .requiredOption('--genre <qgenre>', 'The full name of the genre to search for')
    .requiredOption('--min <minrating>', 'The minimum rating of the titles')
    .option('--from <yrFrom>', 'The start year of the titles')
    .option('--to <yrTo>', 'The end year of the titles')
    .action(bygenre);

async function bygenre(options) {
    try {
        // Construct the query parameters
        const params = new URLSearchParams({
            qgenre: options.genre,
            minrating: options.minrating
        });

        // Add optional year range to the query parameters if provided
        if (options.from) {
            params.append('yrFrom', options.from);
        }
        if (options.to) {
            params.append('yrTo', options.to);
        }

        // Make the GET request to the bygenre endpoint
        const response = await axios.get(`http://localhost:7117/bygenre?${params}`);

        // Directory where the file will be saved
        const dir = './cli_responses';

        // Create the directory if it doesn't exist
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }

        // Filename based on the genre query, sanitized to remove special characters
        const filename = `bygenre_${options.genre.replace(/[^a-z0-9]/gi, '_')}.json`;

        // Path for the new file
        const filePath = path.join(dir, filename);

        // Save the response data to a JSON file
        fs.writeFile(filePath, JSON.stringify(response.data, null, 2), (err) => {
            if (err) {
                console.error('Error writing file:', err);
            } else {
                console.log(`Genre search results saved to ${filePath}`);
            }
        });
    } catch (error) {
        console.error('Error performing genre search:', error);
    }
}
    
// 17 -- nameID
program
    .command('nameid')
    .description('Fetch details of a person by their nameID from the ntuaflix database')
    .requiredOption('--nameid <nameID>', 'The nameID (nconst) of the person to fetch details for')
    .action(getNameById);

async function getNameById(options) {
    try {
        // Make the GET request to the name endpoint
        const response = await axios.get(`http://localhost:7117/name/:nameID${options.nameid}`);

        // Directory where the file will be saved
        const dir = './cli_responses';

        // Create the directory if it doesn't exist
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }

        // Path for the new file
        const filePath = path.join(dir, `name_${options.nameid}.json`);

        // Save the response data to a JSON file
        fs.writeFile(filePath, JSON.stringify(response.data, null, 2), (err) => {
            if (err) {
                console.error('Error writing file:', err);
            } else {
                console.log(`Person details saved to ${filePath}`);
            }
        });
    } catch (error) {
        console.error('Error fetching person details:', error);
    }
}

//18 --name
// 18 -- searchname
program
    .command('searchname')
    .description('Search for people in the ntuaflix database by a part of the name')
    .requiredOption('--namepart <namePart>', 'The part of the name to search for')
    .action(searchname);

async function searchname(options) {
    try {
        // Make the GET request to the searchname endpoint with the name part
        const response = await axios.get(`http://localhost:7117/searchname?namePart=${encodeURIComponent(options.namePart)}`);

        // Directory where the file will be saved
        const dir = './cli_responses';

        // Create the directory if it doesn't exist
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }

        // Sanitize the name part to create a valid filename
        const sanitizedQuery = options.namePart.replace(/[^a-z0-9]/gi, '_');

        // Path for the new file
        const filePath = path.join(dir, `searchname_${sanitizedQuery}.json`);

        // Save the response data to a JSON file
        fs.writeFile(filePath, JSON.stringify(response.data, null, 2), (err) => {
            if (err) {
                console.error('Error writing file:', err);
            } else {
                console.log(`Search by name results saved to ${filePath}`);
            }
        });
    } catch (error) {
        console.error('Error performing search by name:', error);
    }
}

program.parse(process.argv);





