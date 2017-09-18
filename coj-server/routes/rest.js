const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const problemService = require('../services/problemService');


//GET /api/v1/problems
router.get('/problems', function (req, res) {
    problemService.getProblems()
        .then(problems => res.json(problems));
});

//GET /api/v1/problems/:id
router.get('/problems/:id', function (req, res) {
    const id = req.params['id'];
    problemService.getProblem(+id);
});

//POST /api/v1/problems
router.post('/problems', jsonParser, function (req, res) {
    problemService.addProblem(req.body)
        .then(problem => {
            res.json(problem);
        }, error => {
            res.status(400).send('Problem name already exists!');
        });
});

module.exports = router;