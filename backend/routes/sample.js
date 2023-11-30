const express = require('express');

const sampleController = require('../controllers/sample');

const router = express.Router();

router.get('/', sampleController.getSample);
router.get('/movies', sampleController.getMovies);
router.get('/movie/:id', sampleController.getMovieById);
router.post('/:id', sampleController.postSample);

module.exports = router;