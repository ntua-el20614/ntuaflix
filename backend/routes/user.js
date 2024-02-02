const express = require('express');
const userController = require('../controllers/user');
const router = express.Router();

router.get('/check_rating/:userid/:tconst', userController.check_rating); 
router.post('/update_rating/:userid/:tconst/:rating', userController.update_rating); 

module.exports = router;