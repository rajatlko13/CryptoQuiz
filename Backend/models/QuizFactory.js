const mongoose = require('mongoose');

const quizFactorySchema = new mongoose.Schema({
    name: {
        type: String
    },
    description: {
        type: String
    },
    quizContractAddress: {
        type: String
    },
    questionSet: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quiz'
    },
    regStartDate: {
        type: String
    },
    regStartTime: {
        type: String
    },
    playStartDate: {
        type: String
    },
    playStartTime: {
        type: String
    },
    duration: {
        type: Number
    },
    quizStartedTime: {
        type: Number
    },
    regCost : {
        type: Number
    }
}, {timestamps: true});

const quizSchema = new mongoose.Schema({
    quizId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'QuizFactory'
    },
    questions: [
        {
            question: {
                type: String
            },
            option1: {
                type: String
            },
            option2: {
                type: String
            },
            option3: {
                type: String
            },
            option4: {
                type: String
            }
        }
    ]
}, {timestamps: true});

const QuizFactory = mongoose.model('QuizFactory', quizFactorySchema);
const Quiz = mongoose.model('Quiz', quizSchema);

module.exports = { QuizFactory, Quiz };