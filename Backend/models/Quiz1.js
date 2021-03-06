const mongoose = require('mongoose');

const quiz1Schema = new mongoose.Schema({
    question: {
        type: String,
        required:true
    },
    option1: {
        type: String,
        required: true
    },
    option2: {
        type: String,
        required: true
    },
    option3: {
        type: String,
        required: true
    },
    option4: {
        type: String,
        required: true
    }
}, {timestamps: true});

module.exports = mongoose.model('Quiz1', quiz1Schema);