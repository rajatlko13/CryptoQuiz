const express = require('express');
const router = express.Router();

const {getListQuiz1, getQuestionQuiz1, addQuestionQuiz1, updateQuestionQuiz1, removeQuestionQuiz1} = require('../controller/quiz1Controller');

router.get('/', getListQuiz1);
router.get('/:id', getQuestionQuiz1);
router.post('/addQuestion', addQuestionQuiz1);
router.put('/updateQuestion', updateQuestionQuiz1);
router.delete('/removeQuestion', removeQuestionQuiz1);

module.exports = router;