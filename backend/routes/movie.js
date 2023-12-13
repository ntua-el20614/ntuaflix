const express = require('express');

const movieController = require('../controllers/movie');

const router = express.Router();

router.get('/', movieController.getSample);
router.get('/movies', movieController.getMovies);
router.get('/movie/:id', movieController.getMovieById);
router.get('/title/:titleID', movieController.getAllInfoForMovieById);
router.post('/searchtitle', movieController.postPrimaryTitle)
router.post('/bygenre', movieController.postGenre)

module.exports = router;