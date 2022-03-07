var express = require('express');
var router = express.Router();
const model = require('../model').model;
const ObjectId = require('mongodb').ObjectId;
const eventBus = require('../ws').eventBus;
var CryptoJS = require("crypto-js");

var gameObject = {};
var enc_quiz;
let gameLiveId = null;

const key = 'USIHOOTSA32021';

//one game at the time
let gameStarted = false;
let quizLive = false;

router.get("/createGame/:quizId", (req, res) => {
    // fetch the quiz Id from the database.
    if (!ObjectId.isValid(req.params.quizId)) {
        res
            .status(404)
            .end();
        return;
    }
    //fetch the question from the database for a given quizId
    let filter = { _id: new ObjectId(req.params.quizId) };
    model.usi_hoot.findOne(filter).then(result => {
        if (result == null) {
            console.log("No quiz obj found for the given id:", req.params.quizId);
            res
                .status(404)
                .end();
            return;
        }
        gameLiveId = req.params.quizId;
        gameObject.shuffle = []; //list of all correct answers' positions

        result.questions.forEach((element) => {
            gameObject.shuffle.push(Math.floor((Math.random() * 4)));
        });

        enc_quiz = JSON.parse(JSON.stringify(result)); // copy the questions
        
        // encrypt answers 
        for (let x in enc_quiz.questions) {
            let ra = enc_quiz.questions[x].right_answer;
            enc_quiz.questions[x].right_answer = CryptoJS.AES.encrypt(ra, key).toString();

            for (let y in enc_quiz.questions[x].wrong_answers) {
                let wa = enc_quiz.questions[x].wrong_answers[y];
                enc_quiz.questions[x].wrong_answers[y] = CryptoJS.AES.encrypt(wa, key).toString();
            }
        }
        gameObject.current_question_index = 0; //keep track of current question on the server
        gameObject.Quiz = enc_quiz;
        gameObject.Players = [];
        gameObject.Host = req.query.host; // We are not sending a host;
        gameStarted = true;
        eventBus.emit('gameStarted', gameObject);
        res.status(200).json(gameObject).end(); // I changed it to game object
    }).catch(err => {
        res.status(500).end();
        console.log('found an error', err);
    });
});

router.get('/exitGame/:hId', (req, res) => {
    let keyLength = Object.keys(gameObject).length;
    if (!keyLength || req.params.hId != gameLiveId) {
        return res.status(404).end();
    }
    for (var member in gameObject) delete gameObject[member];
    gameStarted = false;
    eventBus.emit('gameEnded', gameObject);
    gameLiveId = null;
    res.status(204).end();
})


// when a player picks the username before entering the game (and after somenone started one)
router.post('/joinGame', (req, res) => {
    if (req.body == undefined || req.body.username == undefined || req.body.username == '') {
        return res.status(400).send({ msg: "You have to write something!" }).end();
    }
    let newName = req.body.username;
    let found = false;
    if (gameStarted && !quizLive) {
        for (let i = 0; i < gameObject.Players.length; i++) {
            if (gameObject.Players[i].username == newName) {
                found = true;
                break
            }
        }
    } else {
        return res.status(400).send({ msg: "No games available or a quiz is already underway!"}).end();
    }

    if (found) {
        return res.status(400).send({ msg: "Username already taken!" }).end();
    }
    else {
        gameObject.Players.push({ username: newName, points: 0 });
        eventBus.emit('player_joined', newName, gameObject);
        return res.status(200).send({ msg: "Good luck!", quiz: enc_quiz}).end();
    }
})

eventBus.on('eliminate_player_go', (msg) =>{
    for (let u in gameObject.Players){
        if (gameObject.Players[u].username == msg.username){
            gameObject.Players.splice(u, 1);
            eventBus.emit('gameChanged', gameObject);
        }
    }
})

eventBus.on('quizChanged', (state)=>{
    quizLive = state;
})

module.exports.gameObject = gameObject;
module.exports = router;