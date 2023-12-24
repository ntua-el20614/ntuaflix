const express = require('express');

const movieController = require('../controllers/movie');

const router = express.Router();

router.get('/', movieController.getSample);
router.get('/movies', movieController.getMovies);
router.get('/movie/:id', movieController.getMovieById);

//a.
router.get('/title/:titleID', movieController.getAllInfoForMovieById);

//b.
router.get('/searchtitle', movieController.postPrimaryTitle)

//c.
router.get('/bygenre', movieController.postGenre)

//e.
router.get('/searchname', movieController.getSearchName)

module.exports = router;