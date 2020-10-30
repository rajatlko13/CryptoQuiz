const mongoose = require('mongoose');

const answersSchema = new mongoose.Schema({
    quizId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'QuizFactory'
    },
    users: [
        {
            // userId: {
            //     type: mongoose.Schema.Types.ObjectId,
            //     ref: 'User'
            // },
            email: {
                type: String
            },
            quizCompleted: Boolean,
            answers: [{
                question: {
                    type: mongoose.Schema.Types.ObjectId,
                },
                option: {
                    type: Number
                }
            }]
        }
    ]
}, {timestamps: true});

const Answers = mongoose.model('Answers', answersSchema);
module.exports = Answers;