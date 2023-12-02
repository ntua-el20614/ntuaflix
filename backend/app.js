const express = require('express');
const cors = require('cors');

/* Import routes */
const movieRoutes = require('./routes/movie');
const peopleRoutes = require('./routes/people');

const app = express();
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/',(req,res,next)=> {res.status(404).json({message: 'Hello and welcome to the backend server of ntuaflix'})})

/* Routes used */
app.use('/api', movieRoutes);
app.use('/api', peopleRoutes); 


app.use((req, res, next) => { res.status(404).json({ message: 'Endpoint not found' }) });

module.exports = app;