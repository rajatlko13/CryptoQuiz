const path = require('path');
const solc = require('solc');
const fs = require('fs-extra');

const buildPath = path.resolve(__dirname, 'build','buildQuiz');
fs.removeSync(buildPath);

const quizPath = path.resolve(__dirname, 'contracts', 'Quiz.sol');
const source = fs.readFileSync(quizPath, 'utf8');

var input = {
  language: 'Solidity',
  sources: {
      'Quiz.sol' : {
          content: source
      }
  },
  settings: {
      outputSelection: {
          '*': {
              '*': [ '*' ]
          }
      }
  }
}; 
let compiledContract = JSON.parse(solc.compile(JSON.stringify(input)));

fs.ensureDirSync(buildPath);

for(let contract in compiledContract.contracts['Quiz.sol']) {
    fs.outputJsonSync(
      path.resolve(buildPath, contract.replace(':', '') + '.json'),
      compiledContract.contracts['Quiz.sol'][contract]
    );
  }

