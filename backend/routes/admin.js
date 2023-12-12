
const express = require('express');

const adminController = require('../controllers/admin');

const router = express.Router();

//XRIAZOMASTE MIDDLEWARES TO VERIFICATION!!!
router.get('/healthcheck', adminController.getHealth); 


module.exports = router;