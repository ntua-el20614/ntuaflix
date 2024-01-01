const express = require('express');

const peopleController = require('../controllers/people');

const router = express.Router();

router.get('/people', peopleController.getPeople);
router.get('/people/profession/:profession', peopleController.getTypeOfPeople);
router.get('/people/one_profession/:profession', peopleController.getTypeOfPeopleOneProfession);

//d
router.get('/name/:nameID', peopleController.getAllInfoForAPerson)

//e.
router.post('/searchname', peopleController.getSearchName)

//top 10 highest rated people
router.get('/toptenpeople', peopleController.getTopTenPeople)

module.exports = router;