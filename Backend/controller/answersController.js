const { json } = require('express');
const Answers  = require('../models/Answers');
require('dotenv').config();

const getListQuizAnswers = async (req,res) => {
    try{
        console.log('in getListQuizAnswers api');
        const listQuizAnswers = await Answers.find();
        res.json(listQuizAnswers);
    }catch(err){
        res.json(err);
    }
}

const getQuizAnswers = async (req,res) => {
    try{
        console.log('in getQuizAnswers api');
        const quiz = await Answers.findOne({ 'quizId': req.params.id });
        console.log(quiz);
        res.json(quiz);
    }catch(err){
        res.json(err);
    }
}

const registerForQuiz = async (req,res) => {
    try {
        console.log('in addAnswersQuiz api');
        console.log(req.body.user);

        const quiz = await Answers.findOneAndUpdate(
            { quizId: req.params.quizId, 'users.email': {$ne: req.body.user.email} },
            { $push: {users: req.body.user }}
        );
        console.log(quiz);
        res.json(quiz);
    } catch (error) {
        res.status(400).json(error);
    }
}

const isRegistered = async (req,res) => {
    console.log('in isRegistered api');
    try {
        const user = await Answers.findOne({ 'quizId': req.params.quizId, 'users.email': req.params.email});
        console.log(user);
        res.json(user);
    } catch (error) {
        res.status(400).json(error);
    }
}

const hasAttempted = async (req,res) => {
    console.log('in hasAttempted api');
    try {
        const user = await Answers.findOne({'quizId': req.params.quizId, 'users': { $elemMatch: { 'email': req.params.email, 'quizCompleted': true}} });
        //const user = await Answers.findOne({'quizId': req.params.quizId, 'users.email': req.params.email, 'users.quizCompleted': true});
        console.log(user);
        res.json(user);
    } catch (error) {
        res.status(400).json(error);
    }
}

const addAnswersQuiz = async (req,res) => {
    try{
        console.log('in addAnswersQuiz api');
        console.log(req.body.user);

        const quiz = await Answers.findOneAndUpdate(
            { quizId: req.params.quizId, 'users.email': req.body.user.email, 'users.quizCompleted': false },
            { $set: {'users.$.quizCompleted': true, 'users.$.answers': req.body.user.answers}}
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

// const updateQuestionQuiz = async (req,res) => {
//     try{
//         console.log('in updateQuestionQuiz api');
//         const updatedQuestion = await Quiz.findOneAndUpdate(
//             {'questions._id': req.body._id},
//             { '$set': {
//                 'questions.$.question': req.body.question, 
//                 'questions.$.option1': req.body.option1,
//                 'questions.$.option2': req.body.option2,
//                 'questions.$.option3': req.body.option3,
//                 'questions.$.option4': req.body.option4
//             } 
//             }
//         );
//         console.log("Done");
//         res.json(updatedQuestion);
//     }catch(err){
//         res.status(400).json(err);
//     }
// }

// const removeQuestionQuiz = async (req,res) => {
//     try{
//         console.log('in removeQuestionQuiz api');
//         console.log(req.body);
//         const deletedQuestion = await Quiz.updateOne(
//             { 'quizId': req.body.id1 },
//             { $pull: {
//                 'questions': {
//                     '_id': req.body.id2
//                 }
//             }}
//         );
//         res.json(deletedQuestion);
//     }catch(err){
//         res.json(err);
//     }
// }

module.exports = { getListQuizAnswers, getQuizAnswers, registerForQuiz, isRegistered, hasAttempted, addAnswersQuiz};
// , updateQuestionQuiz, removeQuestionQuiz