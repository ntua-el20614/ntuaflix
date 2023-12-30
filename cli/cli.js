#!/usr/bin/env node

const { program } = require('commander');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');

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
    .description('Retrieve a title by its ID from the ntuaflix API')
    .requiredOption('--titleID <id>', 'The ID of the title to retrieve')
    .action(title);

async function title(options) {
    try {
        const response = await axios.get(`http://localhost:7117/title/${options.titleID}`);
        
        
    } catch (error) {
        console.error('Error fetching title:', error);
    }
}


// 15 -- searchtitle
program
    .command('searchtitle')
    .description('Search for a title with a part of its name')
    .requiredOption('--titlepart <part>', 'The part of the title name to search for')
    .action(searchtitle);

async function searchtitle(options) {
    try {
        const response = await axios.get(`http://localhost:7117/searchtitle`, {
            params: { q: options.titlepart }
        });
        
        
    } catch (error) {
        console.error('Error searching title:', error);
    }
}


// 16 -- bygenre
program
    .command('bygenre')
    .description('Retrieve titles by genre with optional filters for minimum and maximum year')
    .requiredOption('--genre <genre>', 'The genre of the titles to retrieve')
    .option('--min <year>', 'The minimum year for filtering titles', '')
    .option('--max <year>', 'The maximum year for filtering titles', '')
    .action(bygenre);

async function bygenre(options) {
    try {
        const params = {
            genre: options.genre,
            ...(options.min && { min: options.min }),
            ...(options.max && { max: options.max }),
        };
        const response = await axios.get(`http://localhost:7117/bygenre`, { params });
        
        
    } catch (error) {
        console.error('Error fetching by genre:', error);
    }
}


// 17 -- name
program
    .command('name')
    .description('Retrieve a name by its ID from the ntuaflix API')
    .requiredOption('--nameid <id>', 'The ID of the name to retrieve')
    .action(name);

async function name(options) {
    try {
        const response = await axios.get(`http://localhost:7117/name/${options.nameid}`);
        
        
    } catch (error) {
        console.error('Error fetching name:', error);
    }
}


// 18 -- searchname 
program
    .command('searchname')
    .description('Search for a name in the ntuaflix API')
    .requiredOption('--name <name>', 'The name to search for')
    .action(searchname);

async function searchname(options) {
    try {
        const response = await axios.get(`http://localhost:7117/searchname`, {
            params: { q: options.name }
        });
        
        
    } catch (error) {
        console.error('Error searching name:', error);
    }
}

program.parse(process.argv);





