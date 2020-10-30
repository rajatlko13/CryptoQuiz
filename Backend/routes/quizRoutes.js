const express = require('express');
const router = express.Router();

const {getListQuiz, getQuiz, addQuestionQuiz, updateQuestionQuiz, removeQuestionQuiz} = require('../controller/quizController');

router.get('/', getListQuiz);
router.get('/:id', getQuiz);
router.post('/addQuestion', addQuestionQuiz);
router.put('/updateQuestion', updateQuestionQuiz);
router.post('/removeQuestion', removeQuestionQuiz);

module.exports = router;