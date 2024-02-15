const express = require('express');
const logoutController = require('../controllers/logout');
const verifyToken = require('../middlewares/verifyToken');
const router = express.Router();

router.post('/logout', verifyToken, logoutController.logout);

module.exports = router;