const express = require('express');

const movieController = require('../controllers/movie');

const router = express.Router();

router.get('/', movieController.getSample);
router.get('/movies', movieController.getMovies);
router.get('/movie/:id', movieController.getMovieById);

//a.
router.get('/title/:titleID', movieController.getAllInfoForMovieById);

//b.
router.get('/searchtitle', movieController.getPrimaryTitle)

//c.
router.get('/bygenre', movieController.getGenre)

//e.
router.get('/searchname', movieController.getSearchName)

module.exports = router;