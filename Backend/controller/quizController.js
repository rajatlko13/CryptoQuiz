const { Quiz } = require('../models/QuizFactory');
require('dotenv').config();

const getListQuiz = async (req,res) => {
    try{
        console.log('in getListQuiz api');
        const listQuiz = await Quiz.find();
        res.json(listQuiz);
    }catch(err){
        res.json(err);
    }
}

const getQuiz = async (req,res) => {
    try{
        console.log('in getQuiz api');
        const questionQuiz = await Quiz.findOne({ 'quizId': req.params.id });
        console.log(questionQuiz);
        res.json(questionQuiz);
    }catch(err){
        res.json(err);
    }
}

const addQuestionQuiz = async (req,res) => {
    try{
        console.log('in addQuestionQuiz api');
        console.log(req.body);
        const newQuestion = {
            question: req.body.question,
            option1: req.body.option1,
            option2: req.body.option2,
            option3: req.body.option3,
            option4: req.body.option4
        };
        const quiz = await Quiz.findOneAndUpdate(
            { quizId: req.body.id},
            { $push: {questions: newQuestion}}
        );
        console.log(quiz);
        // quiz.questions.push(newQuestion);
        // console.log("Again",quiz);
        // const nq = await quiz.save();
        res.json(quiz);
    }catch(err){
        res.status(400).json(err);
    }
} 

const updateQuestionQuiz = async (req,res) => {
    try{
        console.log('in updateQuestionQuiz api');
        const updatedQuestion = await Quiz.findOneAndUpdate(
            {'questions._id': req.body._id},
            { '$set': {
                'questions.$.question': req.body.question, 
                'questions.$.option1': req.body.option1,
                'questions.$.option2': req.body.option2,
                'questions.$.option3': req.body.option3,
                'questions.$.option4': req.body.option4
            } 
            }
        );
        console.log("Done");
        res.json(updatedQuestion);
    }catch(err){
        res.status(400).json(err);
    }
}

const removeQuestionQuiz = async (req,res) => {
    try{
        console.log('in removeQuestionQuiz api');
        console.log(req.body);
        const deletedQuestion = await Quiz.updateOne(
            { 'quizId': req.body.id1 },
            { $pull: {
                'questions': {
                    '_id': req.body.id2
                }
            }}
        );
        res.json(deletedQuestion);
    }catch(err){
        res.json(err);
    }
}

module.exports = { getListQuiz, getQuiz, addQuestionQuiz, updateQuestionQuiz, removeQuestionQuiz};