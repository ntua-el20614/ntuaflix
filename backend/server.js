const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());


app.get('/', (req, res) => {
    res.send('Hello, world!');
  });

// Start the server
const port = "7117";
const ipAddress = 'localhost';//
app.listen(port, ipAddress, () => {
  console.log(`Server is running on http://${ipAddress}:${port}`);//${ipAddress}:
});