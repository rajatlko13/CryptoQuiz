const Quiz1 = require('../models/Quiz1');
const bcrypt = require('bcrypt');
require('dotenv').config();

const getListQuiz1 = async (req,res) => {
    try{
        console.log('in getListQuiz1 api');
        const listQuiz1 = await Quiz1.find();
        res.json(listQuiz1);
    }catch(err){
        res.json(err);
    }
}

const getQuestionQuiz1 = async (req,res) => {
    try{
        console.log('in getQuestionQuiz1 api');
        const questionQuiz1 = await Quiz1.findById(req.params.id);
        res.json(questionQuiz1);
    }catch(err){
        res.json(err);
    }
}

const addQuestionQuiz1 = async (req,res) => {
    try{
        console.log('in addQuestionQuiz1 api');
        console.log(req.body);
        const newQuestion = new Quiz1({
            question: req.body.question,
            option1: req.body.option1,
            option2: req.body.option2,
            option3: req.body.option3,
            option4: req.body.option4
        });
        const question = await newQuestion.save();
        res.json(question);
    }catch(err){
        res.status(400).json(err);
    }
} 

const updateQuestionQuiz1 = async (req,res) => {
    try{
        console.log('in updateQuestionQuiz1 api');
        const Question = {
            question: req.body.question,
            option1: req.body.option1,
            option2: req.body.option2,
            option3: req.body.option3,
            option4: req.body.option4
        };
        const updatedQuestion = await Quiz1.findByIdAndUpdate(req.body._id, Question);
        res.json(updatedQuestion);
    }catch(err){
        res.status(400).json(err);
    }
}

const removeQuestionQuiz1 = async (req,res) => {
    try{
        console.log('in removeQuestionQuiz1 api');
        const deletedQuestion = await User.findByIdAndDelete(req.params.id);
        res.json(deletedQuestion);
    }catch(err){
        res.json(err);
    }
}

module.exports = { getListQuiz1, getQuestionQuiz1, addQuestionQuiz1, updateQuestionQuiz1, removeQuestionQuiz1};