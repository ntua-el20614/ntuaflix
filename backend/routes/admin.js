
const express = require('express');

const adminController = require('../controllers/admin');
const authorize = require('../middlewares/authorization')
const multer = require('multer');

const upload = multer({ dest: 'uploads/' }); 
const router = express.Router();


router.get('/healthcheck', adminController.getHealth);

router.post('/upload/titlebasics', authorize, upload.fields([{ name: 'file', maxCount: 1 }, { name: 'data', maxCount: 1 }]), adminController.uploadTitleBasics);



router.post('/usermod/:username/:password', authorize, adminController.chUser);
router.get('/users/:username', authorize, adminController.getUser);
router.get('/test', authorize, adminController.getTest);

module.exports = router;