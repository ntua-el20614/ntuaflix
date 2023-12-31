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
    .description('Retrieve a title by its ID from the ntuaflix API')
    .requiredOption('--titleID <id>', 'The ID of the title to retrieve')
    .action(title);

async function title(options) {
        try {
            const response = await axios.get(`http://localhost:7117/title/${options.titleID}`);
            
            // If the API returns data, log it to the console in a formatted way.
            if (response.data) {
                const titleData = response.data;
    
                // You could further format this output if needed.
                console.log(`Title ID: ${titleData.titleID}`);
                console.log(`Type: ${titleData.type}`);
                console.log(`Original Title: ${titleData.originalTitle}`);
                console.log(`Poster URL: ${titleData.titlePoster}`);
                console.log(`Start Year: ${titleData.startYear}`);
                console.log(`End Year: ${titleData.endYear || 'N/A'}`);
                console.log(`Genres: ${titleData.genres.join(', ')}`);
                
                // Handle the AKAs.
                if (titleData.titleAkas && titleData.titleAkas.length > 0) {
                    console.log(`Also known as:`);
                    titleData.titleAkas.forEach(aka => {
                        console.log(`  - ${aka.akaTitle} (${aka.regionAbbrev})`);
                    });
                }
    
                // Handle the principals.
                if (titleData.principals && titleData.principals.length > 0) {
                    console.log(`Principals:`);
                    titleData.principals.forEach(principal => {
                        console.log(`  - ${principal.name} (${principal.category})`);
                    });
                }
    
                // Handle the rating.
                if (titleData.rating) {
                    console.log(`Rating: ${titleData.rating.avRating}`);
                    console.log(`Votes: ${titleData.rating.nVotes}`);
                }
            } else {
                console.log('No data found for the given title ID.');
            }
        } catch (error) {
            console.error('Error fetching title:', error.message);
        }
    }
    
        

// 15 -- searchtitle
program
    .command('searchtitle')
    .description('Retrieve a titles by a part from the ntuaflix API')
    .requiredOption('--titlepart <part>', 'part of the title we are looking for')
    .action(searchtitle);

// Setup the yargs command to accept a title part as an argument
const argv = yargs(hideBin(process.argv))
  .command('search', 'Search for a movie title', {
    titlePart: {
      description: 'part of the title to search for',
      alias: 't',
      type: 'string',
    },
  })
  .help()
  .alias('help', 'h')
  .argv;

// Function to make the API call to searchtitle endpoint
async function searchtitle (titlePart) {
  try {
    const response = await axios.post('http://localhost:7117/searchtitle', { titlePart: titlePart });
    console.log(response.data);
  } catch (error) {
    console.error('Error connecting to the database:', error.message);
  }
};

// Check if the search command is used and call the searchTitle function
if (argv._.includes('search') && argv.titlePart) {
  searchtitle(argv.titlePart);
} else {
  console.log('Please provide a title part to search for using the -t flag');
}


// 16 -- bygenre

// 17 -- name

program.parse(process.argv);





