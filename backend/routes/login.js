const express = require('express');

const loginController = require('../controllers/login');
const authorize = require('../middlewares/authorization')

const router = express.Router();

router.post('/login', loginController.login);

module.exports = router;