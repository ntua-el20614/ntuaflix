
const express = require('express');

const adminController = require('../controllers/admin');
const authorize = require('../middlewares/authorization')
const multer = require('multer');

const upload = multer({ dest: 'uploads/' }); 
const router = express.Router();

//1
router.get('/healthcheck', adminController.getHealth);

//2-8
router.post('/upload/titlebasics', authorize, upload.fields([{ name: 'file', maxCount: 1 }, { name: 'data', maxCount: 1 }]), adminController.uploadTitleBasics);
router.post('/upload/titleakas', authorize, upload.fields([{ name: 'file', maxCount: 1 }, { name: 'data', maxCount: 1 }]), adminController.uploadTitleAkas);
router.post('/upload/namebasics', authorize, upload.fields([{ name: 'file', maxCount: 1 }, { name: 'data', maxCount: 1 }]), adminController.uploadNameBasics);
router.post('/upload/titlecrew', authorize, upload.fields([{ name: 'file', maxCount: 1 }, { name: 'data', maxCount: 1 }]), adminController.uploadTitleCrew);
router.post('/upload/titleepisode', authorize, upload.fields([{ name: 'file', maxCount: 1 }, { name: 'data', maxCount: 1 }]), adminController.uploadTitleEpisode);
router.post('/upload/titleprincipals', authorize, upload.fields([{ name: 'file', maxCount: 1 }, { name: 'data', maxCount: 1 }]), adminController.uploadTitlePrincipals);
router.post('/upload/titleratings', authorize, upload.fields([{ name: 'file', maxCount: 1 }, { name: 'data', maxCount: 1 }]), adminController.uploadTitleRatings);

//9
//router.post('/upload/', authorize, upload.fields([{ name: 'file', maxCount: 1 }, { name: 'data', maxCount: 1 }]), adminController.upload);

//10-11
router.post('/usermod/:username/:password', authorize, adminController.chUser);
router.get('/users/:username', authorize, adminController.getUser);

//more
router.get('/test', authorize, adminController.getTest);

module.exports = router;