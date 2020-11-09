const { QuizFactory, Quiz } = require('../models/QuizFactory');
const Answers = require('../models/Answers');
require('dotenv').config();

const getListQuizFactory = async (req,res) => {
    try{
        console.log('in getListQuizFactory api');
        const listQuizFactory = await QuizFactory.find();
        res.json(listQuizFactory);
    }catch(err){
        res.json(err);
    }
}

const getQuiz = async (req,res) => {
    try{
        console.log('in getQuiz api');
        const quiz = await QuizFactory.findById(req.params.id);
        res.json(quiz);
    }catch(err){
        res.json(err);
    }
}

const addQuiz = async (req,res) => {
    try{
        console.log('in addQuiz api');
        console.log(req.body);
        const newQuiz = new QuizFactory({
            name: req.body.name,
            description: req.body.description
        });
        const quiz = await newQuiz.save();
        const quizBlock = new Quiz({
            quizId: newQuiz._id
        });
        const q = await quizBlock.save();
        const qsId = q._id;
        quiz.questionSet = qsId;
        const q1 = await quiz.save();

        const answers = new Answers({
            quizId: newQuiz._id
        });
        const ans = await answers.save();

        res.json(q1);
    }catch(err){
        res.status(400).json(err);
    }
} 

const addContractAddress = async (req,res) => {
    try{
        console.log('in addContractAddress api');
        const quiz = await QuizFactory.findById(req.body._id);
        quiz['quizContractAddress'] = req.body.address;
        const q = await quiz.save();
        res.json(q);
    }catch(err){
        res.status(400).json(err);
    }
} 

const addQuizStartedTime = async (req,res) => {
    try {
        console.log('in addQuizStartedTime api');
        const quiz = await QuizFactory.findById(req.body._id);
        console.log(Date.now());
        quiz['quizStartedTime'] = Date.now();
        const q = await quiz.save();
        res.json(q);
    } catch (error) {
        res.json(error);
    }
}

const updateQuiz = async (req,res) => {
    try{
        console.log('in updateQuiz api');
        const Quiz = {
            name: req.body.name,
            description: req.body.description
        };
        const updatedQuiz = await QuizFactory.findByIdAndUpdate(req.body._id, Quiz);
        res.json(updatedQuiz);
    }catch(err){
        res.status(400).json(err);
    }
}

const removeQuiz = async (req,res) => {
    try{
        console.log('in removeQuiz api');
        const deletedQuiz = await QuizFactory.findByIdAndDelete(req.body.id);
        const deletedQuestions = await Quiz.findOneAndDelete({ quizId: req.body.id});
        const deletedAnswers = await Answers.findOneAndDelete({ quizId: req.body.id });
        res.json(deletedQuiz);
    }catch(err){
        res.json(err);
    }
}

module.exports = { getListQuizFactory, getQuiz, addQuiz, addContractAddress, addQuizStartedTime, updateQuiz, removeQuiz };