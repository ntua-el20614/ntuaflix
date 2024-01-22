const express = require('express');

const movieController = require('../controllers/movie');

const router = express.Router();

router.get('/', movieController.getSample);
router.get('/movies', movieController.getMovies);
router.get('/movie/:id', movieController.getMovieById);
router.get('/genres', movieController.getGenres);

//a.
router.get('/title/:titleID', movieController.getAllInfoForMovieById);

//b.
router.post('/searchtitle', movieController.getPrimaryTitle)

//c.
router.post('/bygenre', movieController.getGenre)

//top 20 recent movies
router.get('/topmovies', movieController.getTopMovies)
//get episodes by series id
router.get('/episodes/:titleID', movieController.getEpisodes)

module.exports = router;