const express = require('express');
const router = express.Router();

const {getListQuizAnswers, getQuizAnswers, registerForQuiz, isRegistered, hasAttempted, addAnswersQuiz} = require('../controller/answersController');
// , updateQuestionQuiz, removeQuestionQuiz

router.get('/', getListQuizAnswers);
router.get('/:id', getQuizAnswers);
router.post('/registerUser/:quizId', registerForQuiz);
router.get('/isRegistered/:quizId/:email', isRegistered);
router.get('/hasAttempted/:quizId/:email', hasAttempted);
router.post('/addUserAnswers/:quizId', addAnswersQuiz);
// router.put('/updateQuestion', updateQuestionQuiz);
// router.post('/removeQuestion', removeQuestionQuiz);

module.exports = router;