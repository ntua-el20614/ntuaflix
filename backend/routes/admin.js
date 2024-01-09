
const express = require('express');

const adminController = require('../controllers/admin');
const authorize = require('../middlewares/authorization')
const multer = require('multer');

const upload = multer({ dest: 'uploads/' });
const router = express.Router();

//1
router.get('/healthcheck', adminController.getHealth);

//2-8
router.post('/upload/titlebasics', upload.fields([{ name: 'file', maxCount: 1 }, { name: 'secretKey', maxCount: 1 }, { name: 'is_user_admin', maxCount: 1 }]), authorize, adminController.uploadTitleBasics);
router.post('/upload/titleakas', upload.fields([{ name: 'file', maxCount: 1 }, { name: 'secretKey', maxCount: 1 }, { name: 'is_user_admin', maxCount: 1 }]), authorize, adminController.uploadTitleAkas);
router.post('/upload/namebasics', upload.fields([{ name: 'file', maxCount: 1 }, { name: 'secretKey', maxCount: 1 }, { name: 'is_user_admin', maxCount: 1 }]), authorize, adminController.uploadNameBasics);
router.post('/upload/titlecrew', upload.fields([{ name: 'file', maxCount: 1 }, { name: 'secretKey', maxCount: 1 }, { name: 'is_user_admin', maxCount: 1 }]), authorize, adminController.uploadTitleCrew);
router.post('/upload/titleepisode', upload.fields([{ name: 'file', maxCount: 1 }, { name: 'secretKey', maxCount: 1 }, { name: 'is_user_admin', maxCount: 1 }]), authorize, adminController.uploadTitleEpisode);
router.post('/upload/titleprincipals', upload.fields([{ name: 'file', maxCount: 1 }, { name: 'secretKey', maxCount: 1 }, { name: 'is_user_admin', maxCount: 1 }]), authorize, adminController.uploadTitlePrincipals);
router.post('/upload/titleratings', upload.fields([{ name: 'file', maxCount: 1 }, { name: 'secretKey', maxCount: 1 }, { name: 'is_user_admin', maxCount: 1 }]), authorize, adminController.uploadTitleRatings);

//9
router.post('/resetall', upload.fields([{ name: 'secretKey', maxCount: 1 }, { name: 'is_user_admin', maxCount: 1 }]), authorize, adminController.resetAllData);
router.post('/backup', upload.fields([{ name: 'secretKey', maxCount: 1 }, { name: 'is_user_admin', maxCount: 1 }]), authorize, adminController.bringGivenData);
router.post('/moredata', upload.fields([{ name: 'secretKey', maxCount: 1 }, { name: 'is_user_admin', maxCount: 1 }]), authorize, adminController.bringMoreData);

//router.post('/upload/', upload.fields([{ name: 'file', maxCount: 1 }, { name: 'secretKey', maxCount: 1 }, { name: 'is_user_admin', maxCount: 1 }]), authorize, adminController.upload);

//10-11
router.post('/usermod/:username/:password', upload.fields([{ name: 'secretKey', maxCount: 1 }, { name: 'is_user_admin', maxCount: 1 }]), authorize, adminController.chUser);
router.post('/users/:username', upload.fields([{ name: 'secretKey', maxCount: 1 }, { name: 'is_user_admin', maxCount: 1 }]), authorize, adminController.getUser);

//more
router.post('/test', upload.fields([{ name: 'secretKey', maxCount: 1 }, { name: 'data', maxCount: 1 }]), authorize, adminController.getTest);

module.exports = router;