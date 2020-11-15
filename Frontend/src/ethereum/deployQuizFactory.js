const web3 = require('./web3');
const QuizFactory = require('./build/buildQuiz/QuizFactory.json');
const { addressEIP20 } = require('./addressConfig.json');

const deployQuizFactory = async () => {
    console.log('Inside deploy()');
    const accounts = await web3.eth.getAccounts();
    console.log('Deploying the QuizFactory contract from account ', accounts[0]);
    
    const result = await new web3.eth.Contract(
        JSON.parse(JSON.stringify(QuizFactory.abi))
    ).deploy({ data: QuizFactory.evm.bytecode.object, arguments: [addressEIP20] })
    .send({from: accounts[0]});

    console.log('Deployed to address ',result.options.address); 
    // Ropsten-
    // 0xB3c2E74DB2fB01aE95c4F01b15d8d36Dd7dD4dE8
    // 0xE9BcFf27C2FC2c44C4EeF403E0b6dba86e053f8f
    // 0xd7C5a8001A82E67FDE00Ba47D78df0c7b0D6aC04

    // Rinkeby-
    // 0xaaBa44eC1A195D2190CF214278E4639189EC3dB4
    // 0xb1d4764e78858fDF4761BE08b78e0f0b50460Bf7
    // 0x8E221F63B2c9dd911DAE789f35F8117D06D9bDF3
}

deployQuizFactory();