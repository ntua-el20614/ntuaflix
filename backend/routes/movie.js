const express = require('express');

const movieController = require('../controllers/movie');

const router = express.Router();

router.get('/', movieController.getSample);
router.get('/movies', movieController.getMovies);
router.get('/movie/:id', movieController.getMovieById);
router.get('/movie_all_info/:id', movieController.getAllInfoForMovieById);

module.exports = router;