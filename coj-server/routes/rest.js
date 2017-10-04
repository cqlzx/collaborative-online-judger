const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const Client = require('node-rest-client').Client;
const nodeRestClient = new Client();

const problemService = require('../services/problemService');

EXECUTOR_URL = 'http://localhost:5000/codes';
nodeRestClient.registerMethod('buildAndRun', EXECUTOR_URL, 'POST');

//GET /api/v1/problems
router.get('/problems', function (req, res) {
    problemService.getProblems()
        .then(problems => res.json(problems));
});

//GET /api/v1/problems/:id
router.get('/problems/:id', function (req, res) {
    const id = req.params['id'];
    problemService.getProblem(+id)
        .then(problem => res.json(problem));
});

//POST /api/v1/problems
router.post('/problems', jsonParser, function (req, res) {
    problemService.addProblem(req.body)
        .then(problem => {
            res.json(problem);
        })
        .catch(error => {
            res.status(400).send(error);
        });
});

router.post('/codes', jsonParser, function (req, res) {
   const userCode = req.body.code;
   const language = req.body.language;
   // res.json({'buildMessage': 'OK', 'outputMessage': 'hahahahahah'});
    const data = {
      'language': language,
      'code': userCode
    };
    nodeRestClient.methods.buildAndRun(
        {
            data: data,
            headers: {'Content-Type': 'application/json'}
        }, (data, response) => {
            console.log('data received from executor server');
            data['buildMessage'] = `${data['build']}`;
            data['outputMessage'] = `${data['run']}`;
            res.json(data);
        });
});

module.exports = router;