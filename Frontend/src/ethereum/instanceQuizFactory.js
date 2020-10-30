const web3 = require('./web3');
const QuizFactory = require('./build/buildQuiz/QuizFactory.json');
const { addressQuizFactory } = require('./addressConfig.json');

const instanceQuizFactory = new web3.eth.Contract(
    JSON.parse(JSON.stringify(QuizFactory.abi)),
    addressQuizFactory
);

module.exports = instanceQuizFactory;