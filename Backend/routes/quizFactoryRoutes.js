const express = require('express');
const router = express.Router();

const {getListQuizFactory, getQuiz, addQuiz, addContractAddress, updateQuiz, removeQuiz } = require('../controller/quizFactoryController');
// updateQuestionQuiz1, removeQuestionQuiz1

router.get('/', getListQuizFactory);
router.get('/:id', getQuiz);
router.post('/addQuiz', addQuiz);
router.post('/addContractAddress', addContractAddress);
router.put('/updateQuiz', updateQuiz);
router.post('/removeQuiz', removeQuiz);

module.exports = router;