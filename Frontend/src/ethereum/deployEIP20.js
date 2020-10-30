const web3 = require('./web3');
const EIP20 = require('./build/buildEIP20/EIP20.json');

const deployEIP20 = async () => {
    console.log('Inside deploy()');
    const accounts = await web3.eth.getAccounts();
    console.log('Deploying the EIP20 contract from account ', accounts[0]);
    
    const result = await new web3.eth.Contract(
        JSON.parse(JSON.stringify(EIP20.abi))
    ).deploy({ data: EIP20.evm.bytecode.object, arguments: [10000,'QuizCoin',0,'QC']})
    .send({from: accounts[0]});

    console.log('Deployed to address ',result.options.address); 
    // Ropsten-
    // 0xca02df4414D6798837FB2340F7268B542d599779
    // 0x5fbb011b3a0cd0117d1f6d8e582668c9192ea237

    // Rinkeby-
    // 0x492360a5B2e90bb8Bf70A2C3084c39315EDD1cb3
}

deployEIP20();