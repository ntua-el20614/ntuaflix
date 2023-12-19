
const express = require('express');

const adminController = require('../controllers/admin');
const authenticate = require('../middlewares/authorization')
const router = express.Router();

//XRIAZOMASTE MIDDLEWARES TO VERIFICATION!!!
router.get('/healthcheck', adminController.getHealth); 
router.get('/test', authenticate, adminController.getTest);

module.exports = router;