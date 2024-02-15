const express = require('express');

const peopleController = require('../controllers/people');

const router = express.Router();

router.get('/people', peopleController.getPeople);
router.get('/people/profession/:profession', peopleController.getTypeOfPeople);
router.get('/people/one_profession/:profession', peopleController.getTypeOfPeopleOneProfession);
router.get('/person/:nameID',peopleController.getOnePerson);
router.get('/character/:nameID/:titleID',peopleController.getCharacter);
router.get('/crew/:titleID',peopleController.getCrew);
//d
router.get('/name/:nameID', peopleController.getAllInfoForAPerson)

//mistiko
router.get('/other_movies/:nconst', peopleController.getActorTitlesRolesAndCharacters);


//e.
router.post('/searchname', peopleController.getSearchName)

//top 10 highest rated people
router.get('/toptenpeople', peopleController.getTopTenPeople)

module.exports = router;