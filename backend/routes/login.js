const express = require('express');
const loginController = require('../controllers/login');
const router = express.Router();

router.post('/login', loginController.login);

module.exports = router;