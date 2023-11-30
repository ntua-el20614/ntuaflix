const express = require('express');
const cors = require('cors');

/* Import routes */
const sampleRoutes = require('./routes/sample');

const app = express();
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* Routes used */
app.use('/api', sampleRoutes);

app.use((req, res, next) => { res.status(404).json({ message: 'Endpoint not found' }) });

module.exports = app;