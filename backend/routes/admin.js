
const express = require('express');

const adminController = require('../controllers/admin');
const authenticate = require('../middlewares/authorization')
const router = express.Router();

//XRIAZOMASTE MIDDLEWARES TO VERIFICATION!!!
router.get('/healthcheck', adminController.getHealth);



router.post('/usermod/:username/:password', authenticate, adminController.chUser);
router.get('/users/:username', authenticate, adminController.getUser);
router.get('/test', authenticate, adminController.getTest);

module.exports = router;