const express = require('express');
const router = express.Router();
module.exports = router;
const model = require('../model').model;
const ObjectId = require('mongodb').ObjectId;
const eventBus = require('../ws').eventBus;

// POST /quizForm
router.post('/', (req, res) => {
    let quiz = { questions: [] };
    let i = 0;

    if (req.body == undefined) {
        return res.status(400).end();
    }

    //iterates over all questions in the form and builds them one by one
    try {
        while (req.body['question_' + i]) {
            let new_question = {
                q: req.body['question_' + i], // A question  in its  string  representation
                wrong_answers: [req.body['wrong0_' + i], req.body['wrong1_' + i], req.body['wrong2_' + i]], //  Three  Wrong  answers  here
                right_answer: req.body['correct_' + i],
                difficulty: req.body['difficulty_' + i],
            }

            quiz.questions.push(new_question);
            i++;
        }
    } catch (error) {
        console.log(error);
        return res.status(400).end();
    }

    //save in the database
    model.usi_hoot.insertOne(quiz).then(() =>{
        eventBus.emit('quiz.created', quiz);
    })
    

    res.status(200).json(quiz).end();
});

router.delete('/:quizId', (req, res) => {
    model.usi_hoot.findOneAndDelete({ _id: ObjectId(req.params.quizId) }, {})
        .then((result) => {
            if (result.value == null) {
                //object was not found
                res.status(404).end();
            } else {
                //object successfully deleted
                res.status(204).end();
                eventBus.emit('quiz.deleted', result);
            }
        }).catch(err => {
            console.log("Error in deleting",err);
            res.status(500).end();
        });
});

router.put('/:quizId', (req, res) => {
    if (!ObjectId.isValid(req.params.quizId)) {
        return res.status(400).end();
    }
    let query = {_id : ObjectId(req.params.quizId)};
    let quiz = { questions: [] };
    let i = 0;
    if (req.body == undefined) {
        return res.status(400).end();
    }
    try {
        while (req.body['question_' + i]) {
            let new_question = {
                q: req.body['question_' + i], // A question  in its  string  representation
                wrong_answers: [req.body['wrong0_' + i], req.body['wrong1_' + i], req.body['wrong2_' + i]], //  Three  Wrong  answers  here
                right_answer: req.body['correct_' + i],
                difficulty: req.body['difficulty_' + i],
            }

            quiz.questions.push(new_question);
            i++;
        }
    } catch (error) {
        console.log(error);
        return res.status(400).end();
    }
    model.usi_hoot.replaceOne(query, quiz, {upsert : true}).then(result => {
        if (!result) {
            return res.status(500).end();
        }
        let msg = { id: req.params.quizId, quiz: quiz}
        eventBus.emit('quiz.modified', msg);
        return res.status(200).json(result).end();
    }).catch(err => {
        console.log("Internal server error in replacing one", err);
        res.status(500).end();
    });
});

router.get('/:quizId', (req, res) => {
    if (ObjectId.isValid(req.params.quizId)) {
        let filter = { _id: ObjectId(req.params.quizId)};
        model.usi_hoot.findOne(filter).then(quizData => {
            if (quizData == null) {
                res.status(404).end();
            }
            else {
                res.status(200).json(quizData).end();
            }
        }).catch((err) => {
            console.log(err);
            res.status(500).end();
        });
    } else {
        res.status(400).end();
    }
});