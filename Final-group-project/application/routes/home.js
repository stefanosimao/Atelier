var express = require('express');
var router = express.Router();
const model = require('../model').model;
const eventBus = require('../ws').eventBus;

let gameStarted = false;  

// GET /joinGame
/* return the gameStarted flag  with eventbus*/
router.get('/joinGame', function (req, res) {
  res.status(200).send(gameStarted).end();
});

// GET /hostNewGame
router.get('/hostGame', function (req, res) {
  model.usi_hoot.find().toArray().then(availableQuizzes =>{
    //send back the available quizzes to render in the browser
    res.status(200).json(availableQuizzes).end();
  }).catch((err) => {
    console.log(err);
    res.status(500).end();
  });
});

module.exports = router;

eventBus.on('gameStarted', () => {
  gameStarted = true;
})

eventBus.on('gameEnded', () => {
  gameStarted = false;
})