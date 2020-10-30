const web3 = require('./web3');
const Quiz = require('./build/buildQuiz/Quiz.json');

const instanceQuiz = (addressQuiz) => {
    return new web3.eth.Contract(
        JSON.parse(JSON.stringify(Quiz.abi)),
        addressQuiz
    );
} 

module.exports = instanceQuiz;